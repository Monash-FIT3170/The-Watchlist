// Carousel.jsx

import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import ContentInfoModal from '../../modals/ContentInfoModal';

const Carousel = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [filter, setFilter] = useState('Movies'); // 'Movies' or 'TV Shows'
  const [isOpen, setIsOpen] = useState(false);
  const [fullContent, setFullContent] = useState(null);

  // Filter items based on the selected filter
  const filteredItems = items.filter(
    (item) => item.contentType === (filter === 'Movies' ? 'Movie' : 'TV Show')
  );

  const handleMouseEnter = (index) => {
    if (index !== selectedIndex) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleClick = (index) => {
    setSelectedIndex(index);
    setHoveredIndex(null); // Reset hover state when selecting an item
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedIndex(0);
    setHoveredIndex(null);
  };

  const openModal = () => {
    // Always fetch full content details when opening the modal
    const selectedItem = filteredItems[selectedIndex];
    Meteor.call(
      'content.read',
      { id: selectedItem.contentId, contentType: selectedItem.contentType },
      (error, result) => {
        if (!error && result.content?.length > 0) {
          setFullContent(result.content[0]);
          setIsOpen(true);
        } else {
          console.error('Error fetching content details:', error);
        }
      }
    );
  };

  const closeModal = () => {
    setIsOpen(false);
    setFullContent(null); // Reset fullContent when closing the modal
  };

  // Calculate flexGrow based on state
  const calculateFlexGrow = (index) => {
    if (index === selectedIndex) {
      return 10; // Selected item grows the most
    }
    if (index === hoveredIndex) {
      return 4; // Hovered item grows slightly less
    }
    return 1; // Default size for other items
  };

  // Calculate zIndex based on state
  const calculateZIndex = (index) => {
    if (index === selectedIndex) {
      return 3;
    }
    if (index === hoveredIndex) {
      return 2;
    }
    return 1;
  };

  return (
    <div className="relative w-full h-[500px] text-white z-10 overflow-hidden">
      {/* Toggle for Filters */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h1 className="text-2xl font-bold text-white text-left">Trending</h1>
        <div className="flex justify-left w-full ml-4">
          <button
            className={`text-white py-2 px-6 rounded-full shadow mr-4 transition-colors duration-300 ${
              filter === 'Movies' ? 'bg-[#7B1450]' : 'bg-gray-700 hover:bg-[#7B1450]'
            }`}
            onClick={() => handleFilterChange('Movies')}
            aria-pressed={filter === 'Movies'}
          >
            Movies
          </button>
          <button
            className={`text-white py-2 px-6 rounded-full shadow transition-colors duration-300 ${
              filter === 'TV Shows' ? 'bg-[#7B1450]' : 'bg-gray-700 hover:bg-[#7B1450]'
            }`}
            onClick={() => handleFilterChange('TV Shows')}
            aria-pressed={filter === 'TV Shows'}
          >
            TV Shows
          </button>
        </div>
      </div>

      {/* Carousel Items */}
      <div className="flex h-full">
        {filteredItems.map((item, index) => {
          const isSelected = index === selectedIndex;
          const isHovered = index === hoveredIndex;

          const flexGrow = calculateFlexGrow(index);
          const zIndex = calculateZIndex(index);

          return (
            <div
              key={index}
              className="relative transition-all duration-300 ease-in-out"
              style={{
                flexGrow: flexGrow,
                flexShrink: 1,
                flexBasis: '0%',
                zIndex: zIndex,
                transition: 'flex-grow 0.3s ease-in-out',
              }}
              onClick={() => handleClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleClick(index);
              }}
              aria-label={`Carousel item ${index + 1}: ${item.title}`}
            >
              {/* Left Panel for Selected Item */}
              {isSelected && (
                <div
                  className="absolute top-0 left-0 w-1/4 h-full flex flex-col items-center justify-center bg-gradient-to-r from-black via-transparent to-transparent rounded-lg"
                  style={{ zIndex: 5 }}
                >
                  <div className="text-6xl font-bold text-[#7B1450]">
                    {index + 1}
                  </div>
                  {/* 'See More' button */}
                  <button
                    className="mt-4 px-4 py-2 bg-[#7B1450] rounded"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the click on the item
                      openModal();
                    }}
                  >
                    See More
                  </button>
                </div>
              )}

              {/* Poster Image */}
              <img
                src={item.banner_url || item.background_url}
                alt={item.title}
                className="w-full h-full object-cover shadow-lg cursor-pointer"
              />

              {/* Overlay Shadow for Unselected and Unhovered Items */}
              {!isSelected && !isHovered && (
                <div
                  className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"
                  style={{ zIndex: 1, pointerEvents: 'none' }}
                ></div>
              )}

              {/* Title at the bottom for Selected or Hovered Items */}
              {(isSelected || isHovered) && (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 text-center py-2 my-14"
                  style={{ zIndex: 4 }}
                >
                  <h2 className="text-sm font-bold">{item.title}</h2>
                </div>
              )}

              {/* Rank Number on Unselected Items */}
              {!isSelected && (
                <div
                  className="absolute top-2 right-2 text-2xl font-bold text-white"
                  style={{ zIndex: 2 }}
                >
                  {index + 1}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Content Info Modal */}
      {isOpen && fullContent && (
        <ContentInfoModal
          content={fullContent}
          isOpen={isOpen}
          onClose={closeModal}
          onRatingUpdate={() => {
            // Handle rating updates if necessary
          }}
        />
      )}
    </div>
  );
};

export default Carousel;
