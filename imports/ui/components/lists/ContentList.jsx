// ContentList.jsx

import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from '../contentItems/ContentItem';
import usePopup from '../../modals/usePopup';
import ListPopup from './ListPopup';

const ContentList = React.memo(({ list, isUserOwned, globalRatings = {} }) => {
  const navigate = useNavigate();
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();

  return (
    <div className="flex flex-col mb-2 bg-transparent overflow-hidden shadow-none py-0 px-0">
      <div className="flex justify-between items-center mb-0 text-base">
        <button
          onClick={() => handleItemClick(list)}
          className="font-bold text-2xl text-white leading-tight tracking-tight hover:underline cursor-pointer bg-transparent border-none"
        >
          {list.title}
        </button>
        {true && (
          <button onClick={() => handleItemClick(list)} className="text-gray-400 text-base bg-transparent border-none cursor-pointer hover:underline pr-4 pt-2">
            Show all
          </button>
        )}
      </div>
      {list.content.length === 0 && (
        <div className="text-center text-gray-500 mt-2">
          {list.title} List is empty. Add your movies/TV shows.
        </div>
      )}
      <div className="flex space-x-6 overflow-x-hidden py-4">
        {list.content.map((item) => (
          <div key={item.contentId} className="flex-shrink-0" style={{ minWidth: '130px', width: '13%' }}>
            <ContentItem 
              content={item}
              isUserSpecificRating={item.isUserSpecificRating}
              contentType={item.contentType}
              globalRating={globalRatings[item.contentId]?.average || 0}
            />
          </div>
        ))}
      </div>
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
