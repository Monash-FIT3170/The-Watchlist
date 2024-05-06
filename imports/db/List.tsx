import { Class } from 'meteor/jagi:astronomy';

// Define the Mongo collection where lists will be stored
export const ListCollection = new Mongo.Collection<any, any>('list');

// Define the schema for the List
const List = Class.create({
    name: 'List',
    collection: ListCollection,
    fields: {
        userId: String,
        userName: String,
        listId: String,
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
            type: Array,
            default: function() {
                return [];
            }
        },
        'content.$': {
            type: Object,
            fields: {
                type: {
                    type: String,
                    validators: [{
                        type: 'choice',
                        param: ['movie', 'tv', 'user']
                    }]
                },
                id: String,
                title: String,
                image_url: String,
                rating: {
                    type: Number,
                    optional: true  // Optional field, as not all items may have ratings
                }
            }
        },
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
