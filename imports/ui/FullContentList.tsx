import React, { useState } from "react";
import ContentItem from "./ContentItem";
import RenameListModal from "./RenameListModal"; // Import the RenameListModal component

const FullContentList = ({ list, onDeleteList, onRenameList }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // Add state for RenameListModal
  const contentarr = list.content;

  const content = contentarr.map((item, index) => (
    <ContentItem
      key={index}
      id={item.id}
      type={item.type}
      src={item.image_url}
      alt={item.title}
      rating={item.rating}
    />
  ));

  // Close the dropdown when clicking outside of it
  window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">{list.title}</h1>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="dropbtn"
      >
        ...
      </button>
      {isDropdownOpen && (
        <div className="dropdown-content bg-black text-white p-2">
          {list.listId !== "favorite-shows" && list.listId !== "must-watch" && (
            <>
              <button onClick={() => onDeleteList(list.listId)}>
                Delete List
              </button>
              <button
                onClick={() => setIsRenameModalOpen(true)} // Open the RenameListModal when the button is clicked
              >
                Rename List
              </button>
            </>
          )}
        </div>
      )}
      <div className="flex flex-wrap justify-flex-start items-start mt-4">
        {content}
      </div>
      <RenameListModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        onRename={(newName) => onRenameList(list.listId, newName)}
        currentName={list.title}
      />
    </div>
  );
};

export default FullContentList;
