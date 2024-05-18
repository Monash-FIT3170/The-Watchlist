require('dotenv').config();
const axios = require('axios').default;

const { MovieCollection, TVCollection } = require("../imports/db/Content");

export class APIIngestor {

    #baseURL = "https://api4.thetvdb.com/v4";

    #instance = axios.create({
        baseURL: this.#baseURL,
        timeout: 1000,
    });

    #bearerToken;

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

        let req_data = await this.#instance.request(config)
        .catch((error) => {
            if (error.response) {
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
                    movieData["genres"] = extendedData["data"]["genres"].map((genreData) => genreData["name"]);
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
                    image_url: series.image,
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
        

    }
}

// const ingestor = new APIIngestor();
// ingestor.authenticate()
//     .then(async () => {
//         //data = ingestor.getAllMovies();
//         //ingestor.getAllSeries();
// });

