import React, { useState, useEffect } from "react";

interface RatingStarProps {
  totalStars: number;
  rating: number;
}

const RatingStar: React.FC<RatingStarProps> = ({
  totalStars = 5,
  rating: initialRating,
}) => {
  //handle randing for if we are pulling from api
  const roundedRating = Math.round(initialRating * 2) / 2 + 0.5;

  const [displayRating, setDisplayRating] = useState<number>(roundedRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    setDisplayRating(roundedRating);
  }, [roundedRating]);

  const handleMouseLeave = () => {
    setHoverRating(roundedRating);
  };

  const handleClick = (rating: number) => {
    //pass the user rating to the back end??

    //handle the rating as is 0.5 too high.
    rating = rating - 0.5;
    //alert for testing
    alert("User rating: " + rating);
  };

  const handleMouseMove = (
    index: number,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const isHalf = event.clientX - rect.left < rect.width / 2;
    setHoverRating(index - (isHalf ? 0.5 : 0));
  };

  const starType = (index: number): "full" | "half" | "empty" => {
    const rating = hoverRating || displayRating;
    return index <= rating
      ? index <= rating && index > rating - 0.5
        ? "half"
        : "full"
      : "empty";
  };

  return (
    <div className="flex relative w-full">
        <div className = "inset-0 flex">
        {[...Array(totalStars)].map((_, index) => (
        <span key={index} className="text-fuchsia-800 text-l h-8 w-8 flex items-center justify-center font-bold">&#9734;
        </span>
      ))}
      </div>
       <div className="flex absolute">
      {[...Array(totalStars)].map((_, index) => {
        index += 1;
        return (
          <button
            key={index}
            className={`h-8 w-8 ${
              starType(index) === "full"
                ? "text-fuchsia-800"
                : starType(index ) === "half"
                ? "text-fuchsia-800"
                : "text-transparent"
            } transition-colors duration-50`}
            style={{
              clipPath:
                starType(index) === "half"
                  ? "polygon(0 0, 50% 0, 50% 100%, 0% 100%)"
                  : "none",
            }}
            onClick={() => handleClick(hoverRating || displayRating)}
            onMouseMove={(e) => handleMouseMove(index + 0.5, e)}
            onMouseLeave={handleMouseLeave}
          >
            <span className="text-l">&#9733;</span>
          </button>
        );
      })}
      </div> 
    </div>
  );
};

export default RatingStar;