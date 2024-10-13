// ContentList.jsx

import React, { useRef } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes for type-checking
import { useNavigate } from 'react-router-dom';
import ContentItem from '../contentItems/ContentItem';
import usePopup from '../../modals/usePopup';
import ListPopup from './ListPopup';

const ContentList = React.memo(({
  list,
  isUserOwned,
  globalRatings = {},
  hideShowAllButton = false,
  showScrollArrows = true, // Optional prop to toggle arrows
}) => {
  const navigate = useNavigate();
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();
  const containerRef = useRef(null);

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;

      // Get the total width of the container
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      const currentScrollLeft = container.scrollLeft;

      // Calculate the width of one item (including margin/gap)
      const item = container.querySelector('.content-item');
      if (!item) return; // Exit if no items are found

      const itemStyle = getComputedStyle(item);
      const itemWidth = item.offsetWidth;
      const itemMarginRight = parseInt(itemStyle.marginRight);
      const totalItemWidth = itemWidth + itemMarginRight;

      // Calculate how many items are fully visible
      const itemsInView = Math.floor(clientWidth / totalItemWidth);

      // Calculate the amount to scroll (number of items in view times item width)
      const scrollAmount = itemsInView * totalItemWidth;

      let newScrollLeft;
      if (direction === 'left') {
        newScrollLeft = currentScrollLeft - scrollAmount;
        if (newScrollLeft < 0) {
          newScrollLeft = 0;
        }
      } else {
        newScrollLeft = currentScrollLeft + scrollAmount;
        if (newScrollLeft > maxScrollLeft) {
          newScrollLeft = maxScrollLeft;
        }
      }

      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  // Determine whether to show scroll arrows
  const shouldShowArrows = showScrollArrows && list.content.length >= 4;

  return (
    <div className="flex flex-col mb-2 bg-transparent overflow-hidden shadow-none py-0 px-0">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-0 text-base">
        {hideShowAllButton ? (
          <div className="font-bold text-xl text-white leading-tight tracking-tight">
            {list.title}
          </div>
        ) : (
          <button
            onClick={() => handleItemClick(list)}
            className="font-bold text-xl text-white leading-tight tracking-tight hover:underline cursor-pointer bg-transparent border-none"
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

      {/* Items Container with Conditional Scroll Arrows */}
      {shouldShowArrows ? (
        <div className="relative">
          <div
            ref={containerRef}
            className="flex space-x-6 overflow-x-hidden py-4"
          >
            {list.content.map((item) => (
              <div
                key={item.contentId}
                className="flex-shrink-0 content-item" // Added 'content-item' class for querying
                style={{ minWidth: '130px', width: '14.5%' }}
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

          {/* Left Arrow */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-gray-700 transition"
            onClick={() => handleScroll('left')}
            aria-label="Scroll Left"
          >
            &#9664; {/* Replace with an icon if preferred */}
          </button>

          {/* Right Arrow */}
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full focus:outline-none hover:bg-gray-700 transition"
            onClick={() => handleScroll('right')}
            aria-label="Scroll Right"
          >
            &#9654; {/* Replace with an icon if preferred */}
          </button>
        </div>
      ) : (
        // Render items without scroll arrows
        <div className="flex space-x-6 overflow-x-visible py-4">
          {list.content.map((item) => (
            <div
              key={item.contentId}
              className="flex-shrink-0"
              style={{ minWidth: '130px', width: '14.5%' }}
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
      )}

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
