import React from "react";
import RatingStar from "./RatingStar";

interface ContentItemProps {
  src: string;
  alt: string;
  rating: number;
}

const ContentItem: React.FC<ContentItemProps> = ({ src, alt, rating }) => {
    return (
      <div className="flex flex-col items-center mr-4">
        <img
          src={src}
          alt={alt}
          className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
          style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', margin: '8px' }}
        />
        <div className="text-black mt-2 text-center flex-1 font-bold">{alt}</div>
        <RatingStar totalStars={5}  rating={rating}  />
      </div>
    );
  };
  
  export default ContentItem;