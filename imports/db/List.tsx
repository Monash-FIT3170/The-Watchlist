import { Class } from 'meteor/jagi:astronomy';

// Define the Mongo collection where lists will be stored
export const ListCollection = new Mongo.Collection<any, any>('list');

// Define the schema for the List
const List = Class.create({
    name: 'List',
    collection: ListCollection,
    fields: {
        userId: {
            type: String,
            index: 1 // this means that we use an ascending index
        },
        userName: String,
        listId: {
            type: String,
            optional: true, // Might not be optional - depends if we use MongoDB's _id field instead
        },
        title: String,
        description: {
            type: String,
            optional: true, // Making it optional in case there's no description provided, might need to change this
        },
        listType: {
            type: String,
            validators: [{
                type: 'choice',
                param: ['Favorite', 'To Watch', 'Custom'] // Enumerating allowed values, likely to be adding more here - one for Genre?
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
        },
        'content.$.contentId': String,
        'content.$.title': String,
        'content.$.rating': Number,
        'content.$.picture': String,
        'content.$.description': String,
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
