import React, { useState } from "react";

function NewListModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreate(title);
    setTitle("");
    onClose();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return isOpen ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-300">
            List Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full mt-2 p-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="mt-4 bg-magenta hover:bg-dark-magenta text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:ring-opacity-50"
            >
              Create List
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
}

export default NewListModal;
