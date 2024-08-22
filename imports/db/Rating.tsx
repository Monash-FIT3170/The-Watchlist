import { Class } from "meteor/jagi:astronomy";

export const RatingCollection = new Mongo.Collection<any, any>('rating');

export const Rating = Class.create({
    name: "Rating",
    collection: RatingCollection,
    fields: {
        userId: String,
        // user_full_name: String,
        contentType: {
            type: String,
            validators: [{
                type: 'choice',
                param: ["Movie", "TV Show"]
            }]
        },
        contentId: {
            type: Number,
            index: 1
        },
        rating: {
            type: Number,
            validators: [{
                type: 'choice',
                param: [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
            }]
        }
    }
});


