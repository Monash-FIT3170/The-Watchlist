import React from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown';
import ContentItem from './ContentItem';
import { RatingCollection } from '../db/Rating';
import { MovieCollection, TVCollection } from '../db/Content';
import { getImageUrl } from './imageUtils';

const AllRatedContentPage = ({ currentUser }) => {
  const { userId } = useParams();

  const { ratings, ratedContent, isLoading } = useTracker(() => {
    const subscription = Meteor.subscribe('ratedContent', userId);
    const ratings = RatingCollection.find({ userId }).fetch();
    const contentDetails = ratings.map(rating => {
        const collection = rating.contentType === 'Movie' ? MovieCollection : TVCollection;
        const content = collection.findOne({ id: rating.contentId });
        if (content) {
            console.log(`Content for ${rating.contentType}`, content);
        }
        return {
            ...content,
            rating: rating.rating,
            contentType: rating.contentType
        };
    });
    

    return {
      ratings,
      ratedContent: contentDetails,
      isLoading: !subscription.ready()
    };
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-darker min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <Scrollbar className="w-full">
        <div className="flex flex-wrap justify-start items-start gap-8 p-4">
          {ratedContent.length > 0 ? ratedContent.map((content, index) => (
            <ContentItem
              key={index}
              id={content.id}
              type={content.contentType}
              src={getImageUrl(content.image_url)}
              alt={content.title}
              rating={content.rating}
            />
          )) : <p>No rated content available.</p>}
        </div>
      </Scrollbar>
    </div>
  );
};

export default AllRatedContentPage;
