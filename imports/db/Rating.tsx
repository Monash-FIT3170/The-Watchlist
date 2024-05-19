import { Class } from "meteor/jagi:astronomy";

export const RatingCollection = new Mongo.Collection<any, any>('rating');

export const Rating = Class.create({
    name: "Rating",
    collection: RatingCollection,
    fields: {
        // In future this will have a user ID (with an index) and the user name, but this isn't implemented currently
        // user_id: Number,
        // user_full_name: String,
        content_type: {
            type: String,
            validators: [{
                type: 'choice',
                param: ["Movie", "TV"]
            }]
        },
        content_id: {
            type: Number,
            index: 1
        },
        rating: {
            type: Number,
            validators: [{
                type: 'choice',
                param: [1, 2, 3, 4, 5]
            }]
        }
    }
});


