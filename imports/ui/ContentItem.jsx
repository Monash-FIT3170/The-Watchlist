import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ContentInfoModal from './ContentInfoModal'; // Ensure this import is correct
import RatingStar from "./RatingStar";
import { FaGlobe, FaUser } from "react-icons/fa";
import { getImageUrl } from './imageUtils';
import { RatingCollection } from '../db/Rating';

const ContentItem = ({ content, isUserSpecificRating }) => {

    const { rating, isRatingLoading } = useTracker(() => {
        const subscription = Meteor.subscribe('userRatings', Meteor.userId());
        if (!subscription.ready()) {
          return { isRatingLoading: true, rating: content.rating }; // Return the initial rating if the subscription is not ready
        }
      
        const rating = RatingCollection.findOne({ userId: Meteor.userId(), contentId: content.contentId });
        return {
          isRatingLoading: false,
          rating: rating ? rating.rating : content.rating // Default to the existing content rating if no user-specific rating is found
        };
      }, [content.id]);
      

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
                <RatingStar totalStars={5} rating={rating} />
            </div>
        </div>
    );
};

export default ContentItem;
