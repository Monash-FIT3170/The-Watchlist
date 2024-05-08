import React from "react";
import RatingStar from "./RatingStar";

interface ContentItemProps {
  src: string;
  alt: string;
  rating: number;
}

const ContentItem: React.FC<ContentItemProps> = ({ src, alt, rating }) => {
    return (
      <div className="flex flex-col items-start mr-4 mb-2">
        <img
          src={src}
          alt={alt}
          className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
          style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', margin: '8px' }}
        />
        <div className="text-white mt-0 ml-2 text-left flex-1" style={{ fontWeight: 'normal' }}>{alt}</div>
        <div className="ml-1 mt-1"><RatingStar totalStars={5} rating={rating} /></div>
        
      </div>
    );
};

export default ContentItem;
