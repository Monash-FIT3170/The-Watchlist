import React, { useState } from 'react';
import ContentInfoModal from './ContentInfoModal'; // Ensure this import is correct
import RatingStar from "./RatingStar";
import { FaGlobe, FaUser } from "react-icons/fa";
import { getImageUrl } from './imageUtils';

const ContentItem = ({ content, isUserSpecificRating }) => {

    const [isOpen, setOpen] = useState(false);

    const toggleModal = () => {
        setOpen(!isOpen);
    };

    return (
        <div className="flex flex-col items-start mr-4 w-40">
            <button onClick={toggleModal}>
                <img src={content.image_url} alt={content.title} className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer" style={{ width: '160px', height: 'auto', borderRadius: '8px', margin: '8px' }} />
            </button>
            {/* Conditional rendering of the modal */}
            {isOpen && <ContentInfoModal content={content} isOpen={isOpen} onClose={toggleModal} />}
            <div className="text-white mt-0 ml-2 text-left" style={{
                fontWeight: 'normal',
                height: '48px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
            }}>{content.title}</div>
            <div className="flex items-center ml-2 mt-1">
                {isUserSpecificRating ? <FaUser className="mr-1 text-blue-500" /> : <FaGlobe className="mr-1 text-green-500" />}
                <RatingStar totalStars={5} rating={content.rating} />
            </div>
        </div>
    );
};

export default ContentItem;
