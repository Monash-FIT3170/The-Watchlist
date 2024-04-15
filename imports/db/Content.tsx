/**
 * Defines the "Content" class, which is either a movie or TV show.
 * This defines the schema used
 */

import { Class } from 'meteor/jagi:astronomy';

// Create or get the "content" collection
// The <any, any> is needed to make TypeScript happy when creating the Class, not entirely sure why
const ContentCollection = new Mongo.Collection<any, any>('content');

// Define the schema for this collection
const Content = Class.create({
    name: "Content",
    collection: ContentCollection,
    fields: {
        title: {
            type: String,
        }
    }
})

export default Content;
