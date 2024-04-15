/**
 * Defines the operations that can be performed on the "Content" object.
 * In practice, this should probably be refactored into an "api" class and a "database" class.
 */

import { Meteor } from 'meteor/meteor';
import { Handler, HandlerFunc } from './Handler';
import Content from "../../db/Content";


type CreateContentOptions = {
    title: string
}

/**
 * Defines two functions:
 * validate - a validation function to check that the provided parameters are acceptable. Can be null for no validation.
 * run - the function that should run when Meteor.call()'ed. This will return a callback in the form (err, res).
 */
const createContent: HandlerFunc = {
    validate: null,
    run: ({title}: CreateContentOptions) => {
        // Insert a new document into the Content collection 
        Content.insert({
            title: title
        })

        return
    }
}

const ContentHandler = new Handler("content").addCreateHandler(createContent)

/**
 * Create a publisher for this collection
 * In reality, I don't think we would use this for content. Probably just for ratings, if we wanted it to live update. However, this gives a demonstration of how to use it. 
 * */ 
Meteor.publish("content", function publishContent() {
    return Content.find({});
})


export default ContentHandler;