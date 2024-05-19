/**
 * Defines the "Content" class, which is either a movie or TV show.
 * This defines the schema used
 */

import { Class } from 'meteor/jagi:astronomy';

// Create or get the "content" collection
// The <any, any> is needed to make TypeScript happy when creating the Class, not entirely sure why

export const MovieCollection = new Mongo.Collection<any, any>('movie');
export const TVCollection = new Mongo.Collection<any, any>('tv');

// https://api4.thetvdb.com/v4/movies/filter?sort=score
// https://api4.thetvdb.com/v4/movies/148/translations/eng


// Define the schema for this collection
export const Movie = Class.create({
    name: "Movie",
    collection: MovieCollection,
    fields: {
        id: {
            type: Number
        },
        title: {
            type: String,
            index: 'text'
        },
        overview: {
            type: String
        },
        release_year: {
            type: Number
        },
        image_url: {
            type: String
        },
        background_url: {
            type: String
        },
        runtime: {
            type: Number
        },
        rating: {
            type: Number // this will 100% need to be changed later
        },
        genres: {
            type: [String]
        }
        
    },
    indexes: {
        movie_id_unique: {
            fields: {
                id: 1
            },
            options: {
                unique: true
            }
        }
    }
});

export const TV_Episode = Class.create({
    name: "TV_Episode",
    fields: {
        id: {
            type: Number
        },
        title: {
            type: String,
            index: 'text'
        },
        overview: {
            type: String,
            optional: true
        },
        runtime: {
            type: Number
        },
        image_url: {
            type: String,
            optional: true
        }
    }
})

export const TV_Season = Class.create({
    name: "TV_Season",
    fields: {
        season_number: {
            type: Number
        },
        episodes: [TV_Episode]
    }
})

// https://api4.thetvdb.com/v4/series
// https://api4.thetvdb.com/v4/series/70327 for description
// https://api4.thetvdb.com/v4/series/70327/episodes/official for episodes but filter on aired != null
// number = episode number in season
// seasonNumber = as named
export const TV = Class.create({
    name: "TV",
    collection: TVCollection,
    fields: {
        id: {
            type: Number
        },
        title: {
            type: String,
            index: 'text'
        },
        overview: {
            type: String
        },
        image_url: {
            type: String
        },
        background_url: {
            type: String
        },
        first_aired: {
            type: Number
        },
        last_aired: {
            type: Number,
            optional: true
        },
        genres: {
            type: [String]
        },
        seasons: [TV_Season]
    },
    indexes: {
        tv_series_id_unique: {
            fields: {
                id: 1
            },
            options: {
                unique: true
            }
        }
    }
});
