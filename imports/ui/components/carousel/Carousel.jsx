// imports/ui/components/carousel/Carousel.jsx

import React, { useState } from 'react';

const Carousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  if (!items || items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="relative group">
      <div
        className="w-full h-64 bg-center bg-cover duration-500"
        style={{
          backgroundImage: `url(${currentItem.background_url || currentItem.image_url})`,
        }}
      >
        {/* Overlay with content title */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4">
          <h2 className="text-white text-2xl font-bold">{currentItem.title}</h2>
          <p className="text-white mt-2 line-clamp-2">{currentItem.overview}</p>
        </div>
      </div>
      {/* Left Arrow */}
      <div
        className="hidden group-hover:block absolute top-1/2 transform -translate-y-1/2 left-5 text-3xl rounded-full p-2 bg-black bg-opacity-50 text-white cursor-pointer"
        onClick={prevSlide}
      >
        &#10094;
      </div>
      {/* Right Arrow */}
      <div
        className="hidden group-hover:block absolute top-1/2 transform -translate-y-1/2 right-5 text-3xl rounded-full p-2 bg-black bg-opacity-50 text-white cursor-pointer"
        onClick={nextSlide}
      >
        &#10095;
      </div>
      {/* Dots */}
      <div className="flex justify-center py-2">
        {items.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer mx-1 rounded-full h-2 w-2 ${
              index === currentIndex ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
