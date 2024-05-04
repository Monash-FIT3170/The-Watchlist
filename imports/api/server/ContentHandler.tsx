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

function GetContent(searchObject: object): GetContentResults {
    const movieData = Movie.find(searchObject).fetch();
    const tvData = TV.find(searchObject).fetch();

    return {
        movie: movieData,
        tv: tvData,
    }
}


const readContent: HandlerFunc = {
    validate: null,
    run: ({searchString}: GetContentOptions) => {

        if (searchString == null) {
            // Don't use "Content" (which is an Astrology object) here because it doesn't send properly
            // So we can pull straight from the collection instead.
            // This shouldn't be the case, I'll try figure out why it doesn't work properly.

            return GetContent({});
        }

        return GetContent({
            // TODO implement substring search using regex, but this is okay for MVP
            "$text": { "$search": searchString }
        })
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