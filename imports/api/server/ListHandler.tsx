/**
 * Defines the operations that can be performed on the "List" object.
 */

import { Handler, HandlerFunc } from './Handler';
import List, {ListCollection, ContentSummary} from "../../db/List";

type CreateListOptions = {
    userId: string,
    title: string,
    description: string,
    listType: "Favourite" | "To Watch" | "Custom",
    content: typeof ContentSummary[]
}

type GetListOptions = {
    userId: string
}

type AddContentToListOptions = {
    listId: string,
    userId: string,
    content: {
        content_id: number,
        title: string,
        image_url: string,
        user_rating?: number,
        type: 'Movie' | 'TV Show' | 'Episode',
        episode_details?: {
            season_number: number,
            episode_number: number
        }
    }
};

const addContentToList: HandlerFunc = {
    validate: null,
    run: ({ listId, userId, content }: AddContentToListOptions) => {
        // Ensure content is in the correct format
        const contentSummary = new ContentSummary(content).raw();

        ListCollection.update(
            { _id: listId, userId },  // Ensuring that only the owner can update the list
            { $push: { content: contentSummary } }
        );
        
        return;
    }
};

/**
 * Defines two functions:
 * validate - a validation function to check that the provided parameters are acceptable. Can be null for no validation.
 * run - the function that should run when Meteor.call()'ed. This will return a callback in the form (err, res).
 */
const createList: HandlerFunc = {
    validate: null,
    run: ({userId, title, description, listType, content}: CreateListOptions) => {
        const formattedContent = content.map(item => new ContentSummary(item).raw()); // Ensure content is in the correct format
        List.insert({
            userId, 
            userName: "Test User",
            title, 
            description, 
            listType, 
            content: formattedContent
        });
        return;
    }
}


const readList: HandlerFunc = {
    validate: null,
    run: ({userId}: GetListOptions) => {
        return ListCollection.find().fetch();
        // Add userid when implemented:
        // return ListCollection.find({userId}).fetch();

    }
}


const updateList: HandlerFunc = {
    validate: null,
    run: function({listId, userId, updateFields}: {listId: string, userId: string, updateFields: Object}) {
        // Use this.userId to access the current user's ID
        // Use this once users have been implemented
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized', 'You must be logged in to update a list');
        // }
        
        // // Additional check to ensure that the user updating the list is the owner
        // if (this.userId !== userId) {
        //     throw new Meteor.Error('not-authorized', 'You cannot update lists that do not belong to you');
        // }

        ListCollection.update(
            { _id: listId, userId },  // Ensuring that only the owner can update the list
            { $set: updateFields }
        );
        
        return;
    }
}

const deleteList: HandlerFunc = {
    validate: null,
    run: function({listId, userId}: {listId: string, userId: string}) {
        // if (!this.userId) {
        //     throw new Meteor.Error('not-authorized', 'You must be logged in to delete a list');
        // }

        // if (this.userId !== userId) {
        //     throw new Meteor.Error('not-authorized', 'You cannot delete lists that do not belong to you');
        // }
        
        ListCollection.remove({ _id: listId, userId: userId });  // Ensuring that only the owner can delete the list
        
        return;
    }
}

const removeContent: HandlerFunc = {
    validate: null,
    run: ({ listId, contentId }) => {
        ListCollection.update(
            { _id: listId },
            { $pull: { content: { content_id: contentId } } }
        );
        return;
    }
};

// Instantiate the handler and add all handler functions
const ListHandler = new Handler("list")
    .addCreateHandler(createList)
    .addReadHandler(readList)
    .addUpdateHandler(updateList)
    .addDeleteHandler(deleteList)
    .addUpdateHandler(addContentToList, "addContent")
    .addUpdateHandler(removeContent, 'removeContent'); // Using a custom method name

console.log('ListHandler setup complete.');

export default ListHandler;
