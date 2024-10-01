// imports/ui/components/carousel/Carousel.jsx

import React, { useState } from 'react';
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
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedIndex(0);
    setHoveredIndex(null);
  };

  const selectedItem = filteredItems[selectedIndex];

  const toggleModal = () => {
    if (!fullContent) {
      // Fetch full content details
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
    } else {
      setIsOpen(!isOpen);
    }
  };

  const isAnyHovered = hoveredIndex !== null;

  return (
    <div className="relative w-full text-white z-10">
      {/* Toggle for Filters */}
      <div className="flex justify-center p-4">
        <button
          className={`mx-2 px-4 py-2 rounded ${
            filter === 'Movies' ? 'bg-red-600' : 'bg-gray-700'
          }`}
          onClick={() => handleFilterChange('Movies')}
        >
          Movies
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded ${
            filter === 'TV Shows' ? 'bg-red-600' : 'bg-gray-700'
          }`}
          onClick={() => handleFilterChange('TV Shows')}
        >
          TV Shows
        </button>
      </div>

      {/* Carousel Container */}
      <div className="flex overflow-hidden">
        {filteredItems.map((item, index) => {
          const isSelected = index === selectedIndex;
          const isHovered = index === hoveredIndex;

          // Determine the width based on hover state
          let itemWidth = 'w-1/18';
          if (isAnyHovered && !isSelected) {
            if (isHovered) {
              itemWidth = 'w-1/5';
            } else {
              itemWidth = 'w-1/26';
            }
          }

          if (isSelected) {
            return (
              <div key={index} className="flex w-full">
                {/* Left Panel */}
                <div className="w-1/3 flex flex-col items-center justify-center bg-gradient-to-r from-black via-transparent to-transparent">
                  <div className="text-9xl font-bold text-red-600">
                    {index + 1}
                  </div>
                  {/* 'See More' button */}
                  <button
                    className="mt-4 px-6 py-2 bg-red-600 rounded"
                    onClick={toggleModal}
                  >
                    See More
                  </button>
                </div>

                {/* Selected Item */}
                <div
                  className="relative w-4/5 aspect-[3/2] duration-300 cursor-pointer"
                  onClick={() => handleClick(index)}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Poster Image */}
                  <img
                    src={item.banner_url || item.background_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Title at the bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center py-2">
                    <h2 className="text-sm font-bold">{item.title}</h2>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className={`relative ${itemWidth} aspect-[3/2] duration-300 cursor-pointer`}
                onClick={() => handleClick(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Rank Number on Unselected Items */}
                <div className="absolute top-2 right-2 text-2xl font-bold text-white">
                  {index + 1}
                </div>
                {/* Poster Image */}
                <img
                  src={item.banner_url || item.background_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Title at the bottom when hovered */}
                {isHovered && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-center py-2">
                    <h2 className="text-sm font-bold">{item.title}</h2>
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>

      {/* Content Info Modal */}
      {isOpen && fullContent && (
        <ContentInfoModal
          content={fullContent}
          isOpen={isOpen}
          onClose={toggleModal}
          onRatingUpdate={() => {
            // Handle rating updates if necessary
          }}
        />
      )}
    </div>
  );
};

export default Carousel;
