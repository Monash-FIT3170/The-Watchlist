import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ContentInfoModal from './ContentInfoModal'; // Ensure this import is correct
import RatingStar from "./RatingStar";
import { FaGlobe, FaUser } from "react-icons/fa";
import { RatingCollection } from '../db/Rating';

const popcornUrl = "./ExampleResources/popcorn.png"; // Default image URL

const ContentItem = ({ content, isUserSpecificRating }) => {
    const { rating, isRatingLoading } = useTracker(() => {
        const subscription = Meteor.subscribe('userRatings', Meteor.userId());
        if (!subscription.ready()) {
          return { isRatingLoading: true, rating: content.rating };
        }
      
        const userRating = RatingCollection.findOne({ userId: Meteor.userId(), contentId: content.contentId });
        return {
          isRatingLoading: false,
          rating: userRating ? userRating.rating : content.rating
        };
    }, [content.contentId]);

    const [isOpen, setOpen] = useState(false);

    const toggleModal = () => {
        setOpen(!isOpen);
    };

    const handleImageError = (e) => {
        e.target.onerror = null; // Prevent looping
        e.target.src = popcornUrl;
    };

    return (
        <div className="flex flex-col items-start mr-4 w-40">
            <button onClick={toggleModal}>
            <img 
  src={content.image_url || popcornUrl} 
  alt={content.title} 
  onError={handleImageError} 
  className="w-40 h-60 object-cover rounded-md transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer m-2"
/>

            </button>
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
                <RatingStar totalStars={5} rating={rating} isLoading={isRatingLoading} />
            </div>
        </div>
    );
};

export default ContentItem;
