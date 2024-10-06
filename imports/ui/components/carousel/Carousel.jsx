// imports/ui/components/carousel/Carousel.jsx

import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import ContentInfoModal from '../../modals/ContentInfoModal';
import PropTypes from 'prop-types';

const Carousel = ({ items }) => {
  console.log(items)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [filter, setFilter] = useState('Movies'); // 'Movies' or 'TV Shows'
  const [isOpen, setIsOpen] = useState(false);
  const [fullContent, setFullContent] = useState(null);

  // Log initial render
  console.log('Carousel Rendered');

  // Log state changes using useEffect
  useEffect(() => {
    console.log(`State Change - selectedIndex: ${selectedIndex}`);
  }, [selectedIndex]);

  useEffect(() => {
    console.log(`State Change - hoveredIndex: ${hoveredIndex}`);
  }, [hoveredIndex]);

  useEffect(() => {
    console.log(`State Change - filter: ${filter}`);
  }, [filter]);

  useEffect(() => {
    console.log(`State Change - isOpen: ${isOpen}`);
  }, [isOpen]);

  useEffect(() => {
    console.log(`State Change - fullContent: ${fullContent}`);
  }, [fullContent]);

  // Filter items based on the selected filter
  const filteredItems = items.filter(
    (item) => item.contentType === (filter === 'Movies' ? 'Movie' : 'TV Show')
  );

  // Log filtered items
  useEffect(() => {
    console.log(`Filtered Items (${filter}):`, filteredItems);
  }, [filteredItems, filter]);

  const handleMouseEnter = (index) => {
    console.log(`handleMouseEnter called with index: ${index}`);
    if (index !== selectedIndex) {
      setHoveredIndex(index);
      console.log(`Hovered Index set to: ${index}`);
    } else {
      console.log(`Hovered Index not changed because index ${index} is selected`);
    }
  };

  const handleMouseLeave = () => {
    console.log('handleMouseLeave called');
    setHoveredIndex(null);
    console.log('Hovered Index reset to null');
  };

  const handleClick = (index) => {
    console.log(`handleClick called with index: ${index}`);
    setSelectedIndex(index);
    setHoveredIndex(null); // Reset hover state when selecting an item
    console.log(`Selected Index set to: ${index}, Hovered Index reset to null`);
  };

  const handleFilterChange = (newFilter) => {
    console.log(`handleFilterChange called with newFilter: ${newFilter}`);
    setFilter(newFilter);
    setSelectedIndex(0);
    setHoveredIndex(null);
    console.log(`Filter set to: ${newFilter}, Selected Index reset to 0, Hovered Index reset to null`);
  };

  const selectedItem = filteredItems[selectedIndex];
  console.log(`Currently Selected Item:`, selectedItem);

  const openModal = () => {
    console.log('openModal called');
    // Always fetch full content details when opening the modal
    Meteor.call(
      'content.read',
      { id: selectedItem.contentId, contentType: selectedItem.contentType },
      (error, result) => {
        if (!error && result.content?.length > 0) {
          setFullContent(result.content[0]);
          setIsOpen(true);
          console.log('Modal opened with content:', result.content[0]);
        } else {
          console.error('Error fetching content details:', error);
        }
      }
    );
  };

  const closeModal = () => {
    console.log('closeModal called');
    setIsOpen(false);
    setFullContent(null); // Reset fullContent when closing the modal
    console.log('Modal closed and fullContent reset to null');
  };

  // Calculate widths based on state
  const calculateWidth = (index) => {
    if (index === selectedIndex) {
      return '60%';
    }
    if (hoveredIndex !== null) {
      if (index === hoveredIndex) {
        return '15%';
      }
      return '3%';
    }
    return '4.5%';
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

          const width = calculateWidth(index);
          const zIndex = calculateZIndex(index);

          console.log(
            `Rendering Item - Index: ${index}, Title: ${item.title}, isSelected: ${isSelected}, isHovered: ${isHovered}, Width: ${width}, zIndex: ${zIndex}`
          );

          return (
            <div
              key={index}
              className="relative flex-shrink-0 transition-all duration-300 ease-in-out"
              style={{
                width: width,
                zIndex: zIndex,
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
                onLoad={() => {
                  console.log(`Image loaded for item ${index}: ${item.title}`);
                }}
                onError={(e) => {
                  console.error(`Image failed to load for item ${index}: ${item.title}`, e);
                }}
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
            console.log('Rating updated for content:', fullContent);
          }}
        />
      )}
    </div>
  );
};

// Define PropTypes for better type checking
Carousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      contentId: PropTypes.string.isRequired,
      contentType: PropTypes.oneOf(['Movie', 'TV Show']).isRequired,
      banner_url: PropTypes.string,
      background_url: PropTypes.string,
      title: PropTypes.string.isRequired,
      // Add other necessary fields
    })
  ).isRequired,
};

export default Carousel;
