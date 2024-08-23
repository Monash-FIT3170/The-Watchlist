import React, { useEffect, useState, forwardRef } from "react";

const RenameListModal = forwardRef(({ isOpen, onClose, onRename, currentName }, ref) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div
        ref={ref} // Attach the ref here
        className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4"
        onClick={handleModalClick}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-300">
            New List Name:
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="block w-full mt-2 p-2 border border-gray-700 rounded-lg bg-gray-900 text-white"
            />
          </label>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="mt-4 bg-magenta hover:bg-dark-magenta text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:ring-opacity-50"
            >
              Rename List
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
});

export default RenameListModal;
