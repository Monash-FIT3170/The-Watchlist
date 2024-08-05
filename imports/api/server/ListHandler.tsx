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
        contentId: number,
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
    run: function(this: any, { listId, userId, content }: AddContentToListOptions) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to add content to a list');
        }
        if (this.userId !== userId) {
            throw new Meteor.Error('not-authorized', 'You cannot add content to a list that does not belong to you');
        }

        ListCollection.update(
            { _id: listId, userId },
            { $push: { content: new ContentSummary(content).raw() } }
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

        // Choose the user name source here. For simplicity, we're using the 'realName' field.
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
    run: function(this: any, { listId, userId, updateFields }: { listId: string, userId: string, updateFields: Object }) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to update a list');
        }
        if (this.userId !== userId) {
            throw new Meteor.Error('not-authorized', 'You cannot update lists that do not belong to you');
        }

        ListCollection.update(
            { _id: listId, userId },
            { $set: updateFields }
        );
    }
}

const deleteList: HandlerFunc = {
    validate: null,
    run: function({listId, userId}: {listId: string, userId: string}) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to delete a list');
        }

        if (this.userId !== userId) {
            throw new Meteor.Error('not-authorized', 'You cannot delete lists that do not belong to you');
        }

        // Fetch the list to check its title before deletion
        const list = ListCollection.findOne({ _id: listId, userId: userId });
        if (!list) {
            throw new Meteor.Error('not-found', 'List not found');
        }

        // Prevent deletion of Favourite and To Watch lists
        if (list.title === 'Favourite' || list.title === 'To Watch') {
            throw new Meteor.Error('not-allowed', 'Cannot delete Favourite or To Watch lists');
        }

        ListCollection.remove({ _id: listId, userId: userId });  // Ensuring that only the owner can delete the list
        
        return;
    }
}


const removeContent: HandlerFunc = {
    validate: null,
    run: function(this: any, { listId, userId, contentId }: { listId: string, userId: string, contentId: number }) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'You must be logged in to remove content from a list');
        }
        if (this.userId !== userId) {
            throw new Meteor.Error('not-authorized', 'You cannot remove content from lists that do not belong to you');
        }

        ListCollection.update(
            { _id: listId, userId },
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
