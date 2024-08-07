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
        id: number,
        title: string,
        overview?: string,
        image_url: string,
        background_url: string,
        user_rating?: number,
        type: 'Movie' | 'TV Show' | 'Episode',
        runtime?: number,
        release_year?: number,
        language?: string,
        origin_country?: string[],
        genres?: string[],
        episode_details?: {
            season_number: number,
            episode_number: number
        }
    }
};


interface List {
    _id: string;
    userId: string;
    userName: string;
    title: string;
    description?: string;
    listType: "Favourite" | "To Watch" | "Custom";
    content: typeof ContentSummary[];
    subscribers?: string[];
  }

  const addContentToList: HandlerFunc = {
    validate: null,
    run: function(this: any, { listId, userId, content }: AddContentToListOptions) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to add content to a list');
        }
        if (this.userId !== userId) {
            throw new Meteor.Error('not-authorized', 'You cannot add content to a list that does not belong to you');
        }

        const contentSummary = {
            contentId: content.id,
            title: content.title,
            overview: content.overview,
            image_url: content.image_url,
            background_url: content.background_url,
            user_rating: content.user_rating,
            type: content.type,
            runtime: content.runtime,
            release_year: content.release_year,
            language: content.language,
            origin_country: content.origin_country,
            genres: content.genres
        };

        ListCollection.update(
            { _id: listId, userId },
            { $push: { content: new ContentSummary(contentSummary).raw() } }
        );
    }
};


/**
 * Defines two functions:
 * validate - a validation function to check that the provided parameters are acceptable. Can be null for no validation.
 * run - the function that should run when Meteor.call()'ed. This will return a callback in the form (err, res).
 */
const createList: HandlerFunc = {
    validate: null,
    run: function(this: any, { title, description, listType, content }: CreateListOptions) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to create a list');
        }

        // Retrieve user information from the database
        const user = Meteor.users.findOne({_id: this.userId});

        if (!user) {
            throw new Meteor.Error('not-found', 'User not found');
        }

        // Check if a list with the same title already exists for this user
        const existingList = ListCollection.findOne({ userId: this.userId, title });
        if (existingList) {
            throw new Meteor.Error('duplicate-list', 'A list with this title already exists.');
        }

        const userName = user.username || "Anonymous"; // Fallback to 'Anonymous' if no name is found

        List.insert({
            userId: this.userId,
            userName: userName, // Use the dynamically determined name
            title,
            description,
            listType,
            content: content.map(item => new ContentSummary(item).raw())
        });
        return;
    }
};




const readList: HandlerFunc = {
    validate: null,
    run: function(this: any, { userId }: GetListOptions) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to view lists');
        }

        return ListCollection.find({ userId }).fetch();
    }
}


const updateList: HandlerFunc = {
    validate: null,
    run: function(this: any, { listId, updateFields }: { listId: string, updateFields: Partial<List> }) {
        
        if (!this.userId) {
            console.error('Error: User not logged in.');
            throw new Meteor.Error('not-authorized', 'You must be logged in to update a list');
        }

        // Find the list by ID and cast it to the List type
        const list = ListCollection.findOne({ _id: listId }) as List;
        if (!list) {
            console.error('Error: List not found.');
            throw new Meteor.Error('not-found', 'List not found');
        }

        if (list.userId !== this.userId) {
            console.error('Error: User does not own this list.');
            throw new Meteor.Error('not-authorized', 'You cannot update a list that does not belong to you');
        }

        // Prevent renaming of 'Favourite' and 'To Watch' lists
        if ((list.title === 'Favourite' || list.title === 'To Watch') && updateFields.title) {
            console.error('Error: Attempt to rename a protected list (Favourite or To Watch).');
            throw new Meteor.Error('not-allowed', 'Cannot rename Favourite or To Watch lists.');
        }

        const result = ListCollection.update(
            { _id: listId, userId: this.userId },
            { $set: updateFields }
        );
    }
};



const deleteList: HandlerFunc = {
    validate: null,
    run: function(this: any, { listId }: { listId: string }) {
        // Ensure the user is logged in
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to delete a list');
        }

        // Fetch the list to check ownership and its title before deletion
        const list = ListCollection.findOne({ _id: listId, userId: this.userId });
        if (!list) {
            throw new Meteor.Error('not-found', 'List not found');
        }

        // Prevent deletion of Favourite and To Watch lists
        if (list.title === 'Favourite' || list.title === 'To Watch') {
            throw new Meteor.Error('not-allowed', 'Cannot delete Favourite or To Watch lists');
        }

        // Delete the list if ownership is confirmed
        ListCollection.remove({ _id: listId, userId: this.userId });
    }
};



const removeContent: HandlerFunc = {
    validate: null,
    run: function(this: any, { listId, contentId }: { listId: string, contentId: number }) {
        // Ensure the user is logged in
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to remove content from a list');
        }

        // Find the list by ID and ensure it belongs to the logged-in user
        const list = ListCollection.findOne({ _id: listId, userId: this.userId });
        if (!list) {
            throw new Meteor.Error('not-authorized', 'You cannot remove content from lists that do not belong to you');
        }

        // Remove the content from the list
        ListCollection.update(
            { _id: listId, userId: this.userId },
            { $pull: { content: { contentId: contentId } } }
        );
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
