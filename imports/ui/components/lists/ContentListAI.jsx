// ContentListAI.jsx

import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from '../contentItems/ContentItem';
import usePopup from '../../modals/usePopup';
import ListPopup from './ListPopup';

const ContentListAI = ({ list, isUserOwned }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [visibleContentCount, setVisibleContentCount] = useState(0);
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();
  const [globalRatings, setGlobalRatings] = useState({});

  useEffect(() => {
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (!error) {
        setGlobalRatings(result);
      } else {
        console.error("Error fetching global ratings:", error);
      }
    });
  }, []);

  return (
    <div className="flex flex-col mb-2 bg-transparent overflow-hidden shadow-none py-0 px-0">
      <div className="flex justify-between items-center mb-0 text-base">
        <div className="font-bold text-2xl text-white leading-tight tracking-tight pl-2 bg-transparent border-none">
          {list.title}
        </div>
        {isUserOwned && (
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
      <div ref={containerRef} className="flex space-x-6 overflow-x-hidden py-4">
        {list.content.map((item) => (
          <div key={item.contentId} className="flex-shrink-0" style={{ minWidth: '130px', width: '13%' }}>
            <ContentItem
              key={item.contentId}
              content={item}
              isUserSpecificRating={item.isUserSpecificRating}
              contentType={item.contentType}
              globalRating={globalRatings[item.contentId]?.average || 0}
              setGlobalRatings={setGlobalRatings}
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
};

export default ContentListAI;
