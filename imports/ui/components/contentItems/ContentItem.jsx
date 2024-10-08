// src/components/ContentItem.jsx

import React, { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ContentInfoModal from '../../modals/ContentInfoModal';
import RatingStar from "../ratings/RatingStar";
import { FaGlobe, FaUser } from "react-icons/fa";
import { RatingCollection } from '../../../db/Rating';

const popcornUrl = "/images/popcorn.png"; // Ensure correct path

const ContentItem = ({ content, isUserSpecificRating, contentType, globalRating, setGlobalRatings }) => {
    const [isOpen, setOpen] = useState(false);
    const [fullContent, setFullContent] = useState(null);

    const toggleModal = () => {
        if (!fullContent) {
            // Determine the actual content type to pass to content.read
            const actualContentType = content.originalContentType === 'Season' ? 'TV Show' : contentType;
    
            // Prepare the parameters for content.read
            const readParams = {
                id: content.contentId,
                contentType: actualContentType,
            };
    
            // If it's a season, include the seasonId
            if (content.originalContentType === 'Season') {
                readParams.seasonId = content.seasonId;
            }
    
            // Fetch full content details only when the modal is opened
            Meteor.call('content.read', readParams, (error, result) => {
                if (!error) {
                    let contentDetails = null;
    
                    if (result.content?.length > 0) {
                        contentDetails = result.content[0];
                        
                    } else {
                        console.warn("No content found for the given ID and contentType.");
                    }
    
                    setFullContent(contentDetails); // Store the full content details
                    setOpen(true); // Open the modal after fetching
                } else {
                    console.error("Error fetching full content details:", error);
                }
            });
        } else {
            setOpen(!isOpen);
        }
    };
    
    

    const { rating, isRatingLoading } = useTracker(() => {
        if (isUserSpecificRating) {
          const subscription = Meteor.subscribe('userRatings', Meteor.userId());
          if (!subscription.ready()) {
            return { isRatingLoading: true, rating: 0 };
          }
      
          // Build the query
          let query = { userId: Meteor.userId(), contentId: content.contentId };
          if (contentType === 'Season' && content.seasonId) {
            query.seasonId = content.seasonId;
          }
      
          const userRating = RatingCollection.findOne(query);
      
          return {
            isRatingLoading: false,
            rating: userRating ? userRating.rating : 0, // Default to 0 if no user rating is found
          };
        } else {
          return {
            isRatingLoading: false,
            rating: globalRating || 0, // Use the passed globalRating or default to 0
          };
        }
      }, [content.contentId, content.seasonId, contentType, isUserSpecificRating, globalRating]);
      

    const handleImageError = (e) => {
        console.log("image error")
        e.target.onerror = null; // Prevent looping
        e.target.src = popcornUrl;
    };

    return (
        <div className="flex flex-col items-start">
            <button onClick={toggleModal} className="overflow-hidden rounded-md w-full">
                {/* Image container with aspect ratio */}
                <div className="relative w-full" style={{ paddingBottom: '150%' }}>
                    <img
                        src={content.image_url || popcornUrl}
                        alt={content.title}
                        onError={handleImageError}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
                    />
                </div>
            </button>
            {isOpen && fullContent && (
                <ContentInfoModal
                    content={fullContent}
                    isOpen={isOpen}
                    onClose={toggleModal}
                    onRatingUpdate={() => {
                        // Trigger a re-fetch of global ratings
                        Meteor.call('ratings.getGlobalAverages', (error, result) => {
                            if (!error) {
                                setGlobalRatings(result);
                            } else {
                                console.error("Error fetching global ratings:", error);
                            }
                        });
                    }}
                    seasonId={content.originalContentType === 'Season' ? content.seasonId : null} // Pass seasonId if applicable
                />
            )}
            <div className="text-white mt-2 text-left w-full" style={{
                fontWeight: 'normal',
                height: '48px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis'
            }}>
                {content.title}
            </div>
            <div className="flex items-center mt-1">
                {isUserSpecificRating ? 
                    <FaUser className="mr-1 text-blue-500" title="User rating" /> : 
                    <FaGlobe className="mr-1 text-green-500" title="Global average rating" 
                />}
                <RatingStar totalStars={5} rating={rating} isLoading={isRatingLoading} />
            </div>
        </div>
    );
};

export default ContentItem;
