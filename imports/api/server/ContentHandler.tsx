/**
 * Defines the operations that can be performed on the "Content" object.
 * In practice, this should probably be better refactored into an "api" class and a "database" class.
 */

import { Handler, HandlerFunc } from './Handler';
import { Movie, TV } from "../../db/Content";

type GetContentOptions = {
    searchString: string | null
}

type GetContentResults = {
    movie: typeof Movie[] | null
    tv: typeof TV[] | null
}

/**
 * Defines two functions:
 * validate - a validation function to check that the provided parameters are acceptable. Can be null for no validation.
 * run - the function that should run when Meteor.call()'ed. This will return a callback in the form (err, res).
 */
// const createContent: HandlerFunc = {
//     validate: null,
//     run: ({title}: CreateContentOptions) => {
//         // Insert a new document into the Content collection 
//         Content.insert({
//             title: title
//         })

//         return
//     }
// }

function GetContent(searchObject: object, userId: string): GetContentResults {
    const movieData = Movie.find({...searchObject, userId}).fetch().map(doc => doc.raw());
    const tvData = TV.find({...searchObject, userId}).fetch().map(doc => doc.raw());

    return { movie: movieData, tv: tvData }
}

const readContent: HandlerFunc = {
    validate: null,
    run: ({ searchString, userId }: { searchString: string | null, userId: string }) => {
        console.log('Search string received:', searchString);

        let searchCriteria = {};
        if (searchString == null) {
            console.log('Fetching all content...');
            searchCriteria = { userId }; 
        } else {
            console.log('Performing search with:', searchString);
            searchCriteria = { "$text": { "$search": searchString }, userId };
        }

        // Fetch content using the updated search criteria and convert to raw objects
        const results = GetContent(searchCriteria, userId);
        // console.log('Fetched content:', results);
        return results;
    }
}


const ContentHandler = new Handler("content")
    .addReadHandler(readContent)


/**
 * The alternative to the above read method would be to create a publisher for this collection
 * In reality, I don't think we would use this for content. Probably just for ratings, if we wanted it to live update. However, this gives a demonstration of how to use it. 
 * */ 
/*
Meteor.publish("content", function publishContent() {
    return Content.find({});
}) */

export default ContentHandler;