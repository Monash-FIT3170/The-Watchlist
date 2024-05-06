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

export const ContentSummary = Class.create({
    name: "ContentSummary",
    fields: {
        content_id: Number, // lookup id for the content
        title: String,
        image_url: String,
        user_rating: {
            type: Number,
            optional: true
        },
        type: {
            type: String,
            validators: [{
                type: 'choice',
                param: ['Movie', 'TV Show', 'Episode']
            }]
        },
        episode_details: {
            type: EpisodeDetails,
            optional: true
        }
    }
});


// Define the schema for the List
const List = Class.create({
    name: 'List',
    collection: ListCollection,
    fields: {
        userId: Number,
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
                listId: 1
            },
            options: {
                unique: true
            }
        }
    }
});

export default List;
