import React from "react";
import { useState } from "react";

function RenameListModal({ isOpen, onClose, onRename, currentName }) {
  const [newName, setNewName] = useState(currentName);

  const handleSubmit = (event) => {
    event.preventDefault();
    onRename(newName);
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleModalClick}
    >
      <div className="bg-darker rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-white">
            New List Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="block w-full mt-2 p-2 border border-gray-200 rounded-lg text-black"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Rename List
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}

export default RenameListModal;
