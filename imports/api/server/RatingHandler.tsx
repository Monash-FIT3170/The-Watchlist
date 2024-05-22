import { Handler, HandlerFunc } from './Handler';

import { Rating } from '../../db/Rating';
import { Movie, TV } from '../../db/Content';

export type AddRatingOptions = {
    content_type: "TV" | "Movie",
    content_id: Number,
    rating: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5
}

const createRating: HandlerFunc = {
    validate: null,
    run: ({content_type, content_id, rating}: AddRatingOptions) => {

        // Check that the content with the specified ID exists
        if (content_type == "TV" && TV.findOne({id: content_id}) == undefined) {
            throw new Error(`TV series with ID ${content_id} does not exist!`);
        }

        else if (content_type == "Movie" && Movie.findOne({id: content_id}) == undefined) {
            throw new Error(`Movie with ID ${content_id} does not exist!`);
        }
        
        Rating.insert({
            content_type,
            content_id,
            rating
        });
    }
}

const RatingHandler = new Handler("rating")
    .addCreateHandler(createRating);

export default RatingHandler;

// We will also publish the dataset so that clients can get the updated ratings live
Meteor.publish("rating", function publicRating() {
    return Rating.find({});
})