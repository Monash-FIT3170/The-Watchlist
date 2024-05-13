require('dotenv').config();
const axios = require('axios');

class APIIngestor {

    #baseURL = "https://api4.thetvdb.com/v4"

    #instance = axios.create({
        baseURL: this.#baseURL,
        timeout: 1000,
    });

    #bearerToken;

    async authenticate() {
        const data = await this.#instance.post("/login", {
            apikey: process.env.TVDB_KEY
        })
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
        })
        this.#bearerToken = data.data["data"]["token"];
        console.log("Connected to API successfully.");        
    };

    async getURLAsJSON(url) {
        console.log(this.#bearerToken);
        return this.#instance.get(url, {
            headers: { "Authorization": `Bearer ${this.#bearerToken}` }
        })
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
        })
        
    };

    async getAllMovies() {
        let page = 0;
        let next = "/movies?page=0";

        while (next != null) {
            currentData = await this.getURLAsJSON(next).data;

            for (movie in currentData.data) {

                const movieData = {
                    id: movie.id,
                    title: movie.name,
                    release_year: parseInt(movie.year),
                    image_url: movie.image,
                    runtime: movie.runtime,

                };

                translationData = await this.getURLAsJSON(`/movies/${movie.id}/translations/eng`);

                // translationData.data.overview
                

            }

            

            next = currentData["links"]["next"].replace(this.#baseURL, "");
        }
    }

    async getMovie() {

    }
}

ingestor = new APIIngestor();
ingestor.authenticate()
    .then(async () => {
        data = await ingestor.getURLAsJSON("/movies");
        console.log(data.data);
    })

