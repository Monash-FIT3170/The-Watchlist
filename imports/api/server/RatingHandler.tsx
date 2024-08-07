import { Handler, HandlerFunc } from './Handler';
import { Rating } from '../../db/Rating';
import { Movie, TV } from '../../db/Content';
import { Meteor } from 'meteor/meteor';

export type AddRatingOptions = {
    userId: string,  // Add userId to track which user is making the request
    contentType: "TV Show" | "Movie",
    contentId: number,
    rating: 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5
}

const createRating: HandlerFunc = {
    validate: null,
    run: function(this: any, { userId, contentType, contentId, rating }: AddRatingOptions) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to submit a rating');
        }
        if (this.userId !== userId) {
            throw new Meteor.Error('not-authorized', 'You cannot submit a rating on behalf of another user');
        }

        // Check that the content with the specified ID exists
        const contentCollection = contentType === "TV Show" ? TV : Movie;
        if (!contentCollection.findOne({id: contentId})) {
            throw new Meteor.Error('not-found', `Content of type ${contentType} with ID ${contentId} does not exist!`);
        }
        
        Rating.insert({
            userId: this.userId,  // Use the authenticated user's ID
            contentType,
            contentId,
            rating
        });
    }
}

const RatingHandler = new Handler("rating")
    .addCreateHandler(createRating);

export default RatingHandler;

// We will also publish the dataset so that clients can get the updated ratings live
Meteor.publish("rating", function publicRating() {
    return Rating.find({ userId: this.userId }); // Filter to only include ratings by the logged-in user
})
