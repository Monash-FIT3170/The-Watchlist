require('dotenv').config();
const axios = require('axios').default;

const fs = require("node:fs");

const { MovieCollection, TVCollection } = require("../imports/db/Content");

export class APIIngestor {

    #baseURL = "https://api4.thetvdb.com/v4";

    #instance = axios.create({
        baseURL: this.#baseURL,
        timeout: 1000,
    });

    #bearerToken;

    #failures = []

    /**
     * Utility method to make a HTTP request, catching and displaying any errors.
     * This will authenticate against the API using the Bearer token, if it is defined.
     * @param {string} url The relative URL to retrieve, including the preceding "/"
     * @param {string} type The type of request, usually either "GET" or "POST" 
     * @param {object|null} data The data to send alongside a POST/PUT/DELETE request, if needed. 
     * @returns The data result from the fetch request (i.e. the expected output from the API, with all other Axios fields removed).
     */
    async fetch(url, type="GET", data=null) {
        const config = {
            url: url,
            method: type
        }

        if (data != null) {
            config["data"] = data;
        }

        if (this.#bearerToken != null) {
            config["headers"] = { "Authorization": `Bearer ${this.#bearerToken}` }
        }

        let properFail = false;

        let req_data = await this.#instance.request(config)
        .catch((error) => {
            if (error.response) {
                if (error.response.status == 500) {
                    this.#failures.push(config.url);
                    properFail = true;
                }
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            }
            else {
                console.log(`Unknown error: ${error.message}`);
            }

            console.log(error.config);
        });


        // Can't recover from some errors (due to API issues), so give up on this request.
        if (properFail) { return null; }

        // Retry some queries when the API decides to randomly die on us
        if (!req_data) {
            return this.fetch(url, type, data);
        }

        if (!("data" in req_data)) {
            return this.fetch(url, type, data);
        }

        return req_data.data;
    }
    /**
     * Authenticates against the API using the TVDB_KEY environment variable
     */
    async authenticate() {
        const data = await this.fetch("/login", "POST", {
            apikey: Meteor.settings.TVDB_KEY || process.env.TVDB_KEY
        })
        
        this.#bearerToken = data["data"]["token"];
        console.log("Connected to API successfully.");        
    };


    async getAllMovies() {
        let next = "/movies?page=0";

        while (next != null) {
            console.log(`Retrieving URL: ${next}`)
            let currentData = await this.fetch(next);

            

            for (const movie of currentData.data) {
                const movieData = {
                    id: movie.id,
                    title: movie.name,
                    release_year: parseInt(movie.year),
                    
                    runtime: movie.runtime,
                    rating: movie.score,

                    // Provide defaults for values that may not be part of the API
                    overview: "", 
                    genres: []
                };

                // console.log(`Getting extended data for movie: ${movie.id}`)
                // Get the extended movie data, which also includes the overviews.
                let extendedData = await this.fetch(`/movies/${movie.id}/extended?meta=translations&short=true`);

                if (extendedData == null) {
                    console.log("[FAIL] Unsalvagable error on fetch request. Continuing.");
                    continue;
                }

                // Iterate over each overview translation until we find the english one (or choose the first)
                if (extendedData["data"]["translations"]["overviewTranslations"] != null) {
                    movieData["overview"] = extendedData["data"]["translations"]["overviewTranslations"][0]["overview"]

                    for (const overviewTranslation of extendedData["data"]["translations"]["overviewTranslations"]) {
                        if (overviewTranslation["language"] == "eng") { 
                            movieData["overview"] = overviewTranslation["overview"];
                            break;
                        }
                    }
                }
                

                // Store the genre names only
                if (extendedData["data"]["genres"] != null) {
                    movieData["genres"] = extendedData["data"]["genres"].map((extendedData) => extendedData["name"]);
                }

                // Store the full image
                movieData["image_url"] = extendedData["data"]["image"];
                // console.log(movieData);

                MovieCollection.insertAsync(movieData);
            }

        
            next = currentData["links"]["next"].replace(this.#baseURL, "");
        }
    }

    // Retrieves all the series entities, without getting the individual metadata for every series.
    // There will be a second step afterwards to add data to each season.
    async getAllSeries() {
        let next = "/series?page=0";

        while (next != null) {
            console.log(`Retrieving URL: ${next}`);

            let currentData = await this.fetch(next);
            //console.log(currentData);

            for (const series of currentData.data) {
                const seriesData = {
                    id: series.id,
                    title: series.name,
                    overview: series.overview.replace(/(\r\n|\n|\r)/gm, " "),
                    image_url: series.image ? `https://artworks.thetvdb.com${series.image}` : "",
                    first_aired: Date.parse(series.firstAired),
                    last_aired: Date.parse(series.lastAired),
                    
                    // Neither of these fields will be filled yet, but so they they get added to the schema correctly:
                    genres: [],
                    seasons: []
                }

                TVCollection.insert(seriesData);
            }

            next = currentData["links"]["next"].replace(this.#baseURL, "");
        
        }
        
    }

    async populateTVResults() {
        const cursor = TVCollection.find({"seasons": {"$ne": []}}, {fields: {_id: 0, id: 1}});
        let count = 1;

        let mongoOperations = [];

        for await (const series of cursor) {

            // Retrieve and process genre, season and episode
            const genreURL = `/series/${series.id}/extended?meta=episodes&short=true`
            console.log(`Retrieving URL: ${genreURL}`);
            let extendedData = await this.fetch(genreURL);

            if (extendedData == null) {
                console.log("[FAIL] Unsalvagable error on fetch request. Continuing.");
                continue;
            }

            let genres = []

            if (extendedData["data"]["genres"] != null) {
                genres = extendedData["data"]["genres"].map((genre) => genre["name"]);
            }
      
 
            // Retrieve and process episode data
            // We may need to do this separately to ensure we only get official episodes, but the above query should return the right data.
            // const episodeURL = `/series/${series.id}/episodes/official`;
            // console.log(`Retrieving URL: ${episodeURL}`);
            // let episodeData = await this.fetch(episodeURL);

            let seasonData = {}
            for (const episode of extendedData["data"]["episodes"]) {
                // Ignore extra episodes that were not aired or are not official
                if (episode.aired == null || episode.seasonNumber == 0) { continue; }

                if (!(episode.seasonNumber in seasonData)) {
                    seasonData[episode.seasonNumber] = { season_number: episode.seasonNumber, episodes: []}
                } 

                const episodeData = {
                    id: episode.id,
                    title: episode.name,
                    overview: episode.overview,
                    runtime: parseInt(episode.runtime),
                    image_url: episode.image
                }

                seasonData[episode.seasonNumber].episodes.push(episodeData);
            }

            // Store the operation to perform with a bulk write at the end

            const mongoOperation = {
                "updateOne": {
                    "filter": { "id": series.id },
                    "update": { "$set": { seasons: Object.values(seasonData), genres: genres } }
                }
            }

            // Add this operation to the overall Mongo operations to perform
            mongoOperations.push(mongoOperation);

            // Check if we should now bulk write

            if (count % 100 == 0) {
                console.log("Performing Mongo Bulk Write")
                await TVCollection.rawCollection().bulkWrite(mongoOperations);
            }

            count += 1;

        }

        // Write any remaining changes
        if (mongoOperations.length > 0) {
            console.log("Performing final Mongo Bulk Write")
            await TVCollection.rawCollection().bulkWrite(mongoOperations);
        }

        console.log("Finished populating all episode and genre data for TV shows")

        this.appendFailures();
    }

    async getArtwork() {
        const cursor = TVCollection.find({"background_url": {"$exists": false}}, {fields: {_id: 0, id: 1}});
        let count = 1;

        let mongoOperations = [];

        for await (const series of cursor) {

            // Get the background artwork for this series
            const artworkRequestURL = `/series/${series.id}/artworks?type=3`
            console.log(`Retrieving URL: ${artworkRequestURL}`);
            let artworkData = await this.fetch(artworkRequestURL);

            if (artworkData == null) {
                console.log("[FAIL] Unsalvagable error on fetch request. Continuing.");
                continue;
            }

            if (artworkData["data"]["artworks"] != null && artworkData["data"]["artworks"].length > 0) {
                const mongoOperation = {
                    "updateOne": {
                        "filter": { "id": series.id },
                        "update": { "$set": { "background_url": artworkData["data"]["artworks"][0]["image"] } }
                    }
                }
    
                // Add this operation to the overall Mongo operations to perform
                mongoOperations.push(mongoOperation);
            }

            

            // Check if we should now bulk write

            if (count % 100 == 0) {
                console.log("Performing Mongo Bulk Write")
                await TVCollection.rawCollection().bulkWrite(mongoOperations);
            }

            count += 1;

        }

        // Write any remaining changes
        if (mongoOperations.length > 0) {
            console.log("Performing final Mongo Bulk Write")
            await TVCollection.rawCollection().bulkWrite(mongoOperations);
        }

        console.log("Finished populating all background artworks for TV shows")

        this.appendFailures();

    }

    async appendFailures() {
        fs.appendFile("./ingestor_errors.json", JSON.stringify(this.#failures), err => {
            if (err) {
                console.error(err);
            }
        });

        this.#failures = [];
    }
}

// const ingestor = new APIIngestor();
// ingestor.authenticate()
//     .then(async () => {
//         //data = ingestor.getAllMovies();
//         //ingestor.getAllSeries();
// });

