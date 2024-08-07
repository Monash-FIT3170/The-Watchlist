import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';

const ListContext = createContext();

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribedLists, setSubscribedLists] = useState([]); 

  // Fetch lists for the current logged-in user
  const fetchLists = () => {
    const userId = Meteor.userId();
    console.log("Fetching lists for userId:", userId);
    if (!userId) {
      setLists([]);
      setSubscribedLists([]);
      setLoading(false);
      return;
    }
  
    setLoading(true);
  
    Meteor.call("list.read", { userId }, (error, response) => {
      if (error) {
        console.error("Error fetching lists:", error);
      } else {
        console.log("Fetched personal lists:", response);
        setLists(response);
      }
  
      Meteor.call("list.getSubscribed", { userId }, (subError, subResponse) => {
        if (subError) {
          console.error("Error fetching subscribed lists:", subError);
        } else {
          console.log("Fetched subscribed lists:", subResponse);
          setSubscribedLists(subResponse);
        }
        setLoading(false);
      });
    });
  };
  
  
  // Create a new list
  const handleCreateList = (title, listType = "Custom") => {
    const userId = Meteor.userId();
    if (!userId) return;

    const newList = { userId, title, listType, content: [] };
    Meteor.call("list.create", newList, (error) => {
      if (error) {
        console.error("Error creating list:", error);
      } else {
        fetchLists();
      }
    });
  };

  // Delete a list
  const handleDeleteList = (listId) => {
    const userId = Meteor.userId();
    if (!userId) return;

    Meteor.call("list.delete", { listId, userId }, (error) => {
      if (error) {
        console.error("Error deleting list:", error);
      } else {
        fetchLists();
      }
    });
  };

  // Rename a list
  const handleRenameList = (listId, newName) => {
    const userId = Meteor.userId();
    if (!userId) return;

    Meteor.call("list.update", { listId, userId, updateFields: { title: newName } }, (error) => {
      if (error) {
        console.error("Error renaming list:", error);
      } else {
        fetchLists();
      }
    });
  };

  // Remove content from a list
  const handleRemoveContent = (listId, contentId) => {
    const userId = Meteor.userId();
    if (!userId) return;

    Meteor.call("list.removeContent", { listId, userId, contentId }, (error) => {
      if (error) {
        console.error("Error removing content:", error);
      } else {
        fetchLists();
      }
    });
  };

  // Add content to a list
  const handleAddContent = (listId, content) => {
    const userId = Meteor.userId();
    if (!userId) return;

    const list = lists.find(l => l._id === listId);
    if (list && list.content.some(item => item.contentId === content.contentId)) {
      console.warn("Content already exists in the list.");
      return;
    }

    Meteor.call("list.addContent", { listId, userId, content }, (error) => {
      if (error) {
        console.error("Error adding content:", error);
      } else {
        fetchLists();
      }
    });
  };

  const updateSubscriptions = (listId, isSubscribed) => {
    // Optimistically update the subscribedLists
    setSubscribedLists(currentSubscribed => {
      if (isSubscribed) {
        // Find the list that was subscribed to and add it to subscribedLists
        const listToAdd = lists.find(list => list._id === listId);
        if (listToAdd) {
          return [...currentSubscribed, listToAdd];
        }
      } else {
        // Filter out the list that was unsubscribed from
        return currentSubscribed.filter(list => list._id !== listId);
      }
      return currentSubscribed;
    });
  };

  // Use effect to refetch lists whenever the user ID changes
  useEffect(() => {
    fetchLists();
  }, [Meteor.userId()]);  // Dependency on Meteor.userId() to react to user login/logout

  return (
    <ListContext.Provider value={{
      lists,
      subscribedLists,
      loading,
      handleAddContent,
      fetchLists,
      handleCreateList,
      handleDeleteList,
      handleRenameList,
      handleRemoveContent,
      updateSubscriptions
    }}>
      {children}
    </ListContext.Provider>
  );
};

export const useLists = () => useContext(ListContext);
