import React from "react";

interface SingleStarRatingProps {
  rating: number; // Rating should be from 0 to 1 (i.e., 0.8 means 80% of the star is filled)
}

const StarSVG = ({ fillPercentage }: { fillPercentage: number }) => {
  let gradientId = "grad-" + Math.random().toString(36).substr(2, 9);

  return (
    <svg width="16" height="16" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fillPercentage}%`} stopColor="#7B1450" />
          <stop offset={`${fillPercentage}%`} stopColor="transparent" />
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

const SingleStarRating: React.FC<SingleStarRatingProps> = ({ rating }) => {
  // rating is between 0 and 1, so we need to multiply by 100 to get the percentage fill
  const fillPercentage = Math.min(Math.max(rating * 100, 0), 100); // Ensure it stays between 0% and 100%

  return (
    <div className="flex relative w-full justify-start">
      <StarSVG fillPercentage={fillPercentage} />
    </div>
  );
};

export default SingleStarRating;
