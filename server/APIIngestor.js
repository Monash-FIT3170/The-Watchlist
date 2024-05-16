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
     * @returns A Promise that will resolve with the HTTP request data, available via .data
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

        return this.#instance.request(config)
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
    }

    /**
     * Authenticates against the API using the TVDB_KEY environment variable
     */
    async authenticate() {
        const data = await this.fetch("/login", "POST", {
            apikey: process.env.TVDB_KEY
        })
        
        this.#bearerToken = data.data["data"]["token"];
        console.log("Connected to API successfully.");        
    };


    async getAllMovies() {
        let page = 0;
        let next = "/movies?page=0";

        while (next != null) {
            currentData = await this.fetch(next).data;

            for (movie in currentData.data) {

                const movieData = {
                    id: movie.id,
                    title: movie.name,
                    release_year: parseInt(movie.year),
                    image_url: movie.image,
                    runtime: movie.runtime,

                };

                translationData = await this.fetch(`/movies/${movie.id}/translations/eng`).data;
                console.log(translationData);
                // translationData.data.overview
            
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
        data = await ingestor.fetch("/movies");
        console.log(data.data);
    })

