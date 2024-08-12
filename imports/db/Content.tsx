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
        contentId: {
            type: Number,
            index: 1
        },
        title: {
            type: String
        },
        overview: {
            type: String
        },
        release_year: {
            type: Number
        },
        runtime: {
            type: Number
        },
        popularity: {
            type: Number
        },
        language: {
            type: String
        },
        origin_country: {
            type: [String]
        },
        genres: {
            type: [String]
        },
        keywords: {
            type: [String],
            optional: true
        },
        actors: {
            type: [String],
            optional: true
        },
        directors: {
            type: [String],
            optional: true
        },
        background_url: {
            type: String
        },
        image_url: {
            type: String
        }
    },
    indexes: {
        title_text_index: {
            fields: {
                title: "text"
            },
            options: {
                default_language: "none",  // Specify the default language
                language_override: "none"  // Specify the field that overrides the default language
            }
        }
    }
});


export const TV_Episode = Class.create({
    name: "TV_Episode",
    fields: {
        title: {
            type: String
        },
        episode_number: {
            type: Number
        },
        runtime: {
            type: Number,
            optional: true
        }
    }
});

export const TV_Season = Class.create({
    name: "TV_Season",
    fields: {
        season_number: {
            type: Number
        },
        episodes: {
            type: [TV_Episode],
            optional: true // Optional to defer loading until needed
        }
    }
});

export const TV = Class.create({
    name: "TV",
    collection: TVCollection,
    fields: {
        contentId: {
            type: Number,
            index: 1
        },
        title: {
            type: String
        },
        popularity: {
            type: Number,
            optional: true
        },
        overview: {
            type: String,
            optional: true
        },
        first_aired: {
            type: Date,
            optional: true
        },
        last_aired: {
            type: Date,
            optional: true
        },
        genres: {
            type: [String],
            optional: true
        },
        language: {
            type: String,
            optional: true
        },
        origin_country: {
            type: [String],
            optional: true
        },
        keywords: {
            type: [String],
            optional: true
        },
        actors: {
            type: [String],
            optional: true
        },
        directors: {
            type: [String],
            optional: true
        },
        background_url: {
            type: String,
            optional: true
        },
        image_url: {
            type: String,
            optional: true
        },
        seasons: {
            type: [TV_Season],
            optional: true // Optional to defer loading until needed
        }
    },
    indexes: {
        title_text_index: {
            fields: {
                title: "text"
            },
            options: {
                default_language: "none",  // Specify the default language
                language_override: "none"  // Specify the field that overrides the default language
            }
        }
    }
});