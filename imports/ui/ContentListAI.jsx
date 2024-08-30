import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from './ContentItem';
import usePopup from './usePopup';
import ListPopup from './ListPopup';
import { Divider } from '@mui/material';

const ContentListAI = ({ list, isUserOwned }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [visibleContentCount, setVisibleContentCount] = useState(0);
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();
  const [globalRatings, setGlobalRatings] = useState({});

  // Calculate the number of content panels that fit in the container
  const updateVisibleContent = () => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
      const contentWidth = 160 + 16; // Assuming each content pane is 160px wide and has 8px margin on each side
      const visibleContent = Math.floor(containerWidth / contentWidth);
      setVisibleContentCount(visibleContent);
    }
  };

  useEffect(() => {
    // Fetch global ratings using the Meteor method
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
        if (!error) {
            setGlobalRatings(result);
        } else {
            console.error("Error fetching global ratings:", error);
        }
    });
}, []);

  // Update visible content on resize
  useEffect(() => {
    window.addEventListener('resize', updateVisibleContent);
    updateVisibleContent(); // Initial update
    return () => {
      window.removeEventListener('resize', updateVisibleContent);
    };
  }, []);

  return (
    <div className="flex flex-col mb-2 bg-transparent overflow-hidden shadow-none py-0 px-0">
      <div className="flex justify-between items-center mb-0 text-base">
        <div
          className="font-bold text-2xl text-white leading-tight tracking-tight pl-2 bg-transparent border-none" // Styling to make it look like the original h1 plus hover effect
        >
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
      <div ref={containerRef} className="flex justify-flex-start items-start overflow-hidden">
        {React.Children.toArray(list.content.map((item, index) => (
          <ContentItem 
            content={item}
            isUserSpecificRating={item.isUserSpecificRating}
            contentType={item.contentType}
            globalRating={globalRatings[item.contentId]?.average || 0} 
            setGlobalRatings={setGlobalRatings}
          />
        ))).slice(0, visibleContentCount)}
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
