import { Class , Enum } from 'meteor/jagi:astronomy';

// Define the Mongo collection where lists will be stored
export const ListCollection = new Mongo.Collection<any, any>('list');

export const ContentType = Enum.create({
    name: "ContentType",
    identifiers: ["MOVIE", "TV", "EPISODE"]
});

export const EpisodeDetails = Class.create({
    name: "EpisodeDetails",
    fields: {
        season_number: Number,
        episode_number: Number
    }
});

export const SeasonDetails = Class.create({
    name: "SeasonDetails",
    fields: {
        season_number: {
            type: Number
        },
        episodes: {
            type: [EpisodeDetails], // Using the previously defined EpisodeDetails class
            optional: true
        }
    }
});


export const ContentSummary = Class.create({
    name: "ContentSummary",
    fields: {
        contentId: Number, // lookup id for the content
        title: String,
        overview: {
            type: String,
            optional: true
        },
        image_url: String,
        background_url: String,
        user_rating: {
            type: Number,
            optional: true
        },
        contentType: {
            type: String,
            validators: [{
                type: 'choice',
                param: ['Movie', 'TV Show', 'Episode']
            }]
        },
        runtime: {
            type: Number,
            optional: true
        },
        release_year: {
            type: Number,
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
        genres: {
            type: [String],
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
        keywords: {
            type: [String],
            optional: true
        },
        seasons: {
            type: [SeasonDetails], // Adding seasons field
            optional: true
        },
        directors: {
            type: [String],
            optional: true
        },
        actors: {
            type: [String],
            optional: true
        },
    }
});



// Define the schema for the List
const List = Class.create({
    name: 'List',
    collection: ListCollection,
    fields: {
        userId: String,
        userName: String,
        title: String,
        description: {
            type: String,
            optional: true,
        },
        listType: {
            type: String,
            validators: [{
                type: 'choice',
                param: ['Favourite', 'To Watch', 'Custom']
            }]
        },
        content: {
            type: [ContentSummary],
            default: function() {
                return [];
            }
        },
        subscribers: {
            type: [String], // array of userIds
            default: function() {
                return [];
            }
        }
    },
    behaviors: {
        timestamp: {
            hasCreatedField: true,
            createdFieldName: 'createdAt',
            hasUpdatedField: true,
            updatedFieldName: 'updatedAt'
        }
    },
    indexes: {
        listIndex: {
            fields: {
                userId: 1,
                title: 1 
            },
            options: {
                name: "list_unique_userid_title",
                unique: true
            }
        }
    }
});

export default List;
