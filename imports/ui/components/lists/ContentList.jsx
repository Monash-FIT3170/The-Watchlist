// ContentList.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from '../contentItems/ContentItem';
import usePopup from '../../modals/usePopup';
import ListPopup from './ListPopup';

const ContentList = React.memo(({ list, isUserOwned, globalRatings = {}, hideShowAllButton = false }) => {
  const navigate = useNavigate();
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();

  return (
    <div className="flex flex-col mb-2 bg-transparent overflow-hidden shadow-none py-0 px-0">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-0 text-base">
        {hideShowAllButton ? (
          <div className="font-bold text-2xl text-white leading-tight tracking-tight">
            {list.title}
          </div>
        ) : (
          <button
            onClick={() => handleItemClick(list)}
            className="font-bold text-2xl text-white leading-tight tracking-tight hover:underline cursor-pointer bg-transparent border-none"
          >
            {list.title}
          </button>
        )}
        {!hideShowAllButton && (
          <button
            onClick={() => handleItemClick(list)}
            className="text-gray-400 text-base bg-transparent border-none cursor-pointer hover:underline pr-4 pt-2"
          >
            Show all
          </button>
        )}
      </div>

      {/* Empty List Message */}
      {list.content.length === 0 && (
        <div className="text-center text-gray-500 mt-2">
          {list.title} List is empty. Add your movies/TV shows.
        </div>
      )}

      {/* Items Container */}
      <div className="flex flex-nowrap space-x-4 py-4">
        {list.content.map((item) => (
          <div
            key={item.contentId}
            className="flex-[1_1_140px] min-w-[140px]"
          >
            <ContentItem
              content={item}
              isUserSpecificRating={item.isUserSpecificRating}
              contentType={item.contentType}
              globalRating={globalRatings[item.contentId]?.average || 0}
            />
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && selectedList && (
        <ListPopup
          listId={selectedList._id}
          onClose={handleClosePopup}
          onDeleteList={() => console.log("Delete list")}
          onRenameList={() => console.log("Rename list")}
        />
      )}
    </div>
  );
});

export default ContentList;
