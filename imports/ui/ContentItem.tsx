import RatingStar from "./RatingStar";
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContentItemProps {
  id: number;
  src: string;
  alt: string;
  rating: number;
  type: string;
}

const ContentItem: React.FC<ContentItemProps> = ({ id, type, src, alt, rating }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
      navigate(`/${type}${id}`);
    };

    return (

      <div className="flex flex-col items-start mr-4">
        <button
        onClick={handleRedirect}
        >
          <img
            src={src}
            alt={alt}
            className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
            style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', margin: '8px' }}
          />
        </button>

        <div className="text-white mt-0 ml-2 text-left" style={{ fontWeight: 'normal' }}>{alt}</div>
        <div className="ml-1 mt-1"><RatingStar totalStars={5} rating={rating} /></div>
        
      </div>
    );
};

export default ContentItem;
