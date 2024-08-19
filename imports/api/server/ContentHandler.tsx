/**
 * Defines the operations that can be performed on the "Content" object.
 * In practice, this should probably be better refactored into an "api" class and a "database" class.
 */

import { Handler, HandlerFunc } from './Handler';
import { Movie, TV } from "../../db/Content";
import { MovieCollection, TVCollection } from '../../db/Content';
import { check } from 'meteor/check';


type GetContentOptions = {
    searchString: string | null,
    limit: number,
    page: number
}

type GetContentResults = {
    movie: typeof Movie[] | null
    tv: typeof TV[] | null
    title?: string 
}

// Function to get content by IDs
export function GetContentByIds(ids: string[], title: string): GetContentResults {
    const searchObject = { contentId: { $in: ids.map(Number) } };
    const movieData = MovieCollection.find(searchObject).fetch();
    const tvData = TVCollection.find(searchObject).fetch();

    return { movie: movieData, tv: tvData, title: title };
}


// Register the Meteor method for fetching content by IDs
Meteor.methods({
    'content.search'({ ids, title }: { ids: string[], title: string }) {
        check(ids, [String]);
        check(title, String);
        return GetContentByIds(ids, title);
    }
});

const completeTotalMovies = MovieCollection.find().count();
const completeTotalTVShows = TVCollection.find().count();
const completeTotalCount = completeTotalMovies + completeTotalTVShows;


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

function GetContent(searchObject: object, searchOptions: object, sortOptions: object = { popularity: -1 }): GetContentResults {
    const movieData = Movie.find(searchObject, { ...searchOptions, sort: sortOptions }).fetch();
    const tvData = TV.find(searchObject, { ...searchOptions, sort: sortOptions }).fetch();

    return { movie: movieData, tv: tvData };
}

const readContent: HandlerFunc = {
    validate: null,
    run: ({ searchString, limit, page }: GetContentOptions) => {

        let searchOptions = {
            limit: limit ?? 50,
            skip: limit && page ? limit * page : 0
        };

        let searchCriteria = {};
        if (searchString == null || searchString.trim() === '') {
            searchCriteria = {}; // Fetch all content without filtering
        } else {
            searchCriteria = { "$text": { "$search": searchString } };
        }

        // Include a sort option for popularity
        const sortOptions = { popularity: -1 };  // Sorting by popularity in descending order

        // Fetch content using the updated search criteria
        const results = GetContent(searchCriteria, searchOptions, sortOptions);

        let totalCount = 0;
        // Count the total number of items that match the criteria (without pagination)
        if (Object.keys(searchCriteria).length == 0) {
            totalCount = completeTotalCount;
        }
        else {
            const totalMovies = MovieCollection.find(searchCriteria).count();
            const totalTVShows = TVCollection.find(searchCriteria).count();
            totalCount = totalMovies + totalTVShows;
        }
        

        // Use optional chaining to safely access and map over results
        const moviesWithType = results.movie?.map(movie => ({ ...movie, contentType: "Movie" })) || [];
        const tvsWithType = results.tv?.map(tv => ({ ...tv, contentType: "TV Show" })) || [];

        return { 
            movie: moviesWithType, 
            tv: tvsWithType,
            total: totalCount
        };
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