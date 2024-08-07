import React, { useState, useEffect } from "react";

interface ClickableStarRatingProps {
  totalStars: number;
  rating: number;
  onChange: (rating: number) => void;
}
const StarSVG = ({ fill }) => {
  let gradientId = "grad-" + Math.random().toString(36).substr(2, 9);

  return (
    <svg width="27" height="27" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={fill === 1 ? "50%" : fill === 2 ? "100%" : "0%"} stopColor="#7B1450" />
          <stop offset={fill === 1 ? "50%" : "0%"} stopColor="#808080" />
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

const ClickableStarRating: React.FC<ClickableStarRatingProps> = ({
  totalStars = 5,
  rating: initialRating,
  onChange,
}) => {
  const [displayRating, setDisplayRating] = useState(initialRating);

  useEffect(() => {
    setDisplayRating(initialRating);
  }, [initialRating]);

  const handleMouseLeave = () => {
    setDisplayRating(initialRating);
  };

  const handleClick = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();  // Prevent event from bubbling up to parent components
    const fillType = getStarFill(index);
    const newRating = fillType === 1 ? index + 0.5 : index + 1;
    onChange(newRating);
  };

  const handleMouseMove = (index: number, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();  // Optionally prevent mouse move events from propagating
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    setDisplayRating(index + (isHalf ? 0.5 : 1));
  };


  const getStarFill = (index: number) => {
    if (displayRating >= index + 1) return 2;
    if (displayRating >= index + 0.5) return 1;
    return 0;
  };

  return (
    <div className="flex relative w-full justify-start" onMouseLeave={handleMouseLeave}>
      {[...Array(totalStars)].map((_, index) => (
        <div
          key={index}
          className="cursor-pointer"
          style={{ margin: index === 0 ? '0 4px 0 0' : '0 4px' }}
          onMouseMove={(e) => handleMouseMove(index, e)}
          onClick={(e) => handleClick(index, e)}  // Pass the event to the handler
        >
          <StarSVG fill={getStarFill(index)} />
        </div>
      ))}
    </div>

  );

};

export default ClickableStarRating;