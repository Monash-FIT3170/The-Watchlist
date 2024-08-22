import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown';
import ContentItem from './ContentItem';
import { RatingCollection } from '../db/Rating';
import { MovieCollection, TVCollection } from '../db/Content';
import { AiOutlineSearch } from 'react-icons/ai';

const AllRatedContentPage = ({ currentUser }) => {
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = new URLSearchParams(window.location.search);
  const userSpecific = searchParams.get('userSpecific') === 'true';

  const { ratedContent, isLoading } = useTracker(() => {
    const ratingsHandle = Meteor.subscribe('userRatings', userId);
    const ratings = userSpecific 
      ? RatingCollection.find({ userId: currentUser._id }).fetch() 
      : RatingCollection.find({ userId }).fetch();

    // Store all content subscriptions
    const contentSubscriptions = ratings.map(rating => 
      Meteor.subscribe('contentById', rating.contentId, rating.contentType)
    );

    const contentDetails = ratings.map(rating => {
      const collection = rating.contentType === 'Movie' ? MovieCollection : TVCollection;
      const content = collection.findOne({ contentId: rating.contentId });

      return content ? {
        ...content,
        rating: rating.rating,
        contentType: rating.contentType
      } : null;
    }).filter(content => content && content.title && content.title.toLowerCase().includes(searchTerm.toLowerCase()));

    const allSubscriptionsReady = ratingsHandle.ready() && contentSubscriptions.every(sub => sub.ready());

    return {
      ratedContent: contentDetails,
      isLoading: !allSubscriptionsReady
    };
  }, [userId, searchTerm, currentUser, userSpecific]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-darker min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex items-center justify-start mb-4 space-x-7 w-full max-w-xl mt-1 ml-0">
        <div className="relative flex-grow">
          <input
            type="text"
            className="rounded-full bg-dark border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
            placeholder="Search rated content..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <AiOutlineSearch className="text-gray-400" size={20} />
          </span>
        </div>
      </div>
      <Scrollbar className="w-full">
        <div className="flex flex-wrap justify-start items-start gap-8 p-4">
          {ratedContent.length > 0 ? ratedContent.map((content, index) => (
            <ContentItem
              content={content}
              isUserSpecificRating={userSpecific}
              contentType={content.contentType}
            />
          )) : <p>No rated content available.</p>}
        </div>
      </Scrollbar>
    </div>
  );
};

export default AllRatedContentPage;

