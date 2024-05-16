require('dotenv').config();
const axios = require('axios').default;

class APIIngestor {

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

        data = await this.#instance.request(config)
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


        return data.data;
    }
    /**
     * Authenticates against the API using the TVDB_KEY environment variable
     */
    async authenticate() {
        const data = await this.fetch("/login", "POST", {
            apikey: process.env.TVDB_KEY
        })
        
        this.#bearerToken = data["data"]["token"];
        console.log("Connected to API successfully.");        
    };


    async getAllMovies() {
        let page = 0;
        let next = "/movies?page=0&limit=20";

        while (next != null) {
            console.log(`Retrieving URL: ${next}`)
            let currentData = await this.fetch(next);
            console.log(currentData.data);

            for (const movie of currentData.data) {
                console.log(movie);
                const movieData = {
                    id: movie.id,
                    title: movie.name,
                    release_year: parseInt(movie.year),
                    image_url: movie.image,
                    runtime: movie.runtime,
                    rating: movie.score
                };

                console.log(`Getting extended data for movie: ${movie.id}`)
                // Get the extended movie data, which also includes the overviews.
                let extendedData = await this.fetch(`/movies/${movie.id}/extended?meta=translations&short=true`);

                console.log(extendedData);
            }

        
            next = currentData["links"]["next"].replace(this.#baseURL, "");
        }
    }

    async getMovie() {

    }
}

const ingestor = new APIIngestor();
ingestor.authenticate()
    .then(async () => {
        data = ingestor.getAllMovies();
    })

