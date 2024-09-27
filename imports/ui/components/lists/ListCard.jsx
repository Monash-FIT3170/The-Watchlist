// src/components/ListCard.jsx

import React from 'react';
import ListPopup from './ListPopup';
import usePopup from '../../modals/usePopup';

const ListCard = ({ list }) => {
  const popcornUrl = "/images/popcorn.png"; // Ensure correct path
  const {
    isPopupOpen,
    selectedList,
    handleItemClick,
    handleClosePopup,
  } = usePopup();

  return (
    <div
      className="bg-darker border border-transparent rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-dark hover:bg-dark"
      onClick={() => handleItemClick(list)}
    >
      {/* Image section with square aspect ratio */}
      <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200">
        <img
          src={list.content[0]?.image_url || popcornUrl}
          alt={list.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text section */}
      <div className="p-3">
        {/* List title */}
        <h3 className="text-white font-bold text-sm truncate">{list.title}</h3>

        {/* List owner */}
        <p className="text-gray-400 text-xs mt-1">{list.userName}</p>
      </div>

      {/* Conditionally render the popup */}
      {isPopupOpen && selectedList && (
        <ListPopup
          listId={selectedList._id} // Pass the list ID
          onClose={handleClosePopup}
          onDeleteList={() =>
            Meteor.call('list.delete', { listId: selectedList._id })
          } // Call the delete method
          onRenameList={(newName) =>
            Meteor.call('list.update', {
              listId: selectedList._id,
              updateFields: { title: newName },
            })
          } // Call the rename method
        />
      )}
    </div>
  );
};

export default ListCard;
