import React from "react";

interface StarRatingProps {
  totalStars: number;
  rating: number;
}

const roundToNearestHalf = (num: number) => Math.round(num * 2) / 2;

const StarSVG = ({ fill }) => {
  let gradientId = "grad-" + Math.random().toString(36).substr(2, 9);

  return (
    <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={fill === 1 ? "50%" : fill === 2 ? "100%" : "0%"} stopColor="#7B1450" />
          <stop offset={fill === 1 ? "50%" : "0%"} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path
        d="M20.388,10.918L32,12.118l-8.735,7.749L25.914,31.4l-9.893-6.088L6.127,31.4l2.695-11.533L0,12.118 l11.547-1.2L16.026,0.6L20.388,10.918z"
        fill={`url(#${gradientId})`}
        stroke="#7B1450" 
        strokeWidth="1" 
      />
    </svg>
  );
};

const StarRating: React.FC<StarRatingProps> = ({ totalStars = 5, rating }) => {
  const displayRating = roundToNearestHalf(rating);

  const getStarFill = (index: number) => {
    if (displayRating >= index + 1) return 2; 
    if (displayRating >= index + 0.5) return 1; 
    return 0; 
  };

  return (
    <div className="flex relative w-full justify-start">
      {[...Array(totalStars)].map((_, index) => (
        <div key={index} className="cursor-pointer" style={{ margin: '0 4px' }}>
          <StarSVG fill={getStarFill(index)} />
        </div>
      ))}
    </div>
  );
};

export default StarRating;