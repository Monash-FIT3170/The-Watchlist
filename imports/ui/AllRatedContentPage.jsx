import React, { useState, useEffect } from 'react';
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
  const [selectedTab, setSelectedTab] = useState('All');
  const [filteredContent, setFilteredContent] = useState([]);
  const searchParams = new URLSearchParams(window.location.search);
  const userSpecific = searchParams.get('userSpecific') === 'true';

  // Mapping tab labels to contentType values
  const tabMapping = {
    All: 'All',
    Movies: 'Movie',
    'TV Shows': 'TV Show',
  };

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
    }).filter(content => content && content.title);

    const allSubscriptionsReady = ratingsHandle.ready() && contentSubscriptions.every(sub => sub.ready());

    return {
      ratedContent: contentDetails,
      isLoading: !allSubscriptionsReady
    };
  }, [userId, currentUser, userSpecific]);

  useEffect(() => {
    // Filter content based on the search term and selected tab
    const filtered = ratedContent.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = selectedTab === 'All' || content.contentType === tabMapping[selectedTab];
      return matchesSearch && matchesTab;
    });

    setFilteredContent(filtered);
  }, [searchTerm, selectedTab, ratedContent]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();  // Prevent form submission
  };

  return (
    <div className="relative flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2 h-full">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <form className="flex flex-col items-start w-full pl-1" onSubmit={handleFormSubmit}>
        <div className="flex justify-between items-center w-full max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              className="rounded-full bg-dark border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
              placeholder="Search for rated content..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <AiOutlineSearch className="text-gray-400" size={20} />
            </span>
          </div>
        </div>

        {/* Tabs for filtering */}
        <div className="bubbles-container flex justify-end mt-2">
          {Object.keys(tabMapping).map((tab) => (
            <div
              key={tab.toLowerCase()}
              className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${selectedTab === tab ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'
                } border-transparent border`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>
      </form>

      <Scrollbar className="search-results-container flex-grow overflow-auto">
        <div className="grid-responsive">
          {filteredContent.length > 0 ? filteredContent.map((content, index) => (
            <ContentItem
              key={index}
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
