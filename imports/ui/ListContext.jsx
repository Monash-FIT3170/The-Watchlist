import React, { useEffect, useRef, useState, useContext } from "react";
import { createContext } from "react";

const ListContext = createContext();

export const ListsProvider = ({ children }) => {
  const [lists, setLists] = useState([]);

  const fetchLists = () => {
    const userId = 1; // Temporary userId: 1
    Meteor.call("list.read", { userId }, (error, response) => {
      if (error) {
        console.error("Error fetching lists:", error);
      } else {
        setLists(response);
      }
    });
  };

  const handleCreateList = (title) => {
    const userId = 1; // Temporary userId: 1
    const listType = "Custom";
    const newList = { userId, title, listType, content: [] };
    Meteor.call("list.create", newList, (error) => {
      if (error) {
        console.error("Error creating list:", error);
      } else {
        fetchLists();
      }
    });
  };

  const handleDeleteList = (listId) => {
    const userId = 1; // Temporary userId: 1
    Meteor.call("list.delete", { listId, userId }, (error) => {
      if (error) {
        console.error("Error deleting list:", error);
      } else {
        fetchLists();
      }
    });
  };

  const handleRenameList = (listId, newName) => {
    const userId = 1; // Temporary userId: 1
    Meteor.call("list.update", { listId, userId, updateFields: { title: newName } }, (error) => {
      if (error) {
        console.error("Error renaming list:", error);
      } else {
        fetchLists();
      }
    });
  };

  const handleRemoveContent = (listId, contentId) => {
    const userId = 1; // Temporary userId: 1
    Meteor.call("list.removeContent", { listId, userId, contentId }, (error) => {
      if (error) {
        console.error("Error removing content:", error);
      } else {
        fetchLists(); // Refetch all lists
      }
    });
  };

  const handleAddContent = (listId, content) => {
    const userId = 1; // Temporary userId: 1

    // Check if the content already exists in the list
    const list = lists.find(list => list._id === listId);
    if (list && list.content.some(item => item.content_id === content.content_id)) {
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

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <ListContext.Provider value={{ lists, handleAddContent, fetchLists, handleCreateList, handleDeleteList, handleRenameList, handleRemoveContent }}>
      {children}
    </ListContext.Provider>
  );
};

export const useLists = () => useContext(ListContext);
