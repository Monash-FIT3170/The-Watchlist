import React from 'react';
import RatingStar from "./RatingStar";
import { FaGlobeAsia , FaUser } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const ContentItem = ({ id, type, src, alt, rating, isUserSpecificRating }) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate(`/${type}${id}`);
    };

    return (
        <div className="flex flex-col items-start mr-4 w-40">
            <button onClick={handleRedirect}>
                <img src={src} alt={alt} className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer" style={{ width: '160px', height: 'auto', borderRadius: '8px', margin: '8px' }} />
            </button>
            <div className="text-white mt-0 ml-2 text-left" style={{ fontWeight: 'normal', height: '72px', overflow: 'hidden' }}>{alt}</div>
            <div className="flex items-center ml-2 mt-1">
                {isUserSpecificRating ? <FaUser className="mr-1 text-blue-500" /> : <FaGlobeAsia  className="mr-1 text-green-500" />}
                <RatingStar totalStars={5} rating={rating} />
            </div>
        </div>
    );
};

const ContentList = ({ items }) => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {items.map(item => (
                <ContentItem key={item.id} {...item} />
            ))}
        </div>
    );
};

export default ContentItem;