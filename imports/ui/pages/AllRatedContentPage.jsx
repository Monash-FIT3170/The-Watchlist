import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import ContentItem from '../components/contentItems/ContentItem';
import { RatingCollection } from '../../db/Rating';
import { MovieCollection, TVCollection } from '../../db/Content';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

const AllRatedContentPage = ({ currentUser }) => {
  const { userId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [filteredContent, setFilteredContent] = useState([]);
  const [sortOrder, setSortOrder] = useState('descending'); // Default to descending
  const searchParams = new URLSearchParams(window.location.search);
  const userSpecific = searchParams.get('userSpecific') === 'true';

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
    const filtered = ratedContent.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = selectedTab === 'All' || content.contentType === tabMapping[selectedTab];
      return matchesSearch && matchesTab;
    });

    const sorted = filtered.sort((a, b) => {
      return sortOrder === 'ascending' ? a.rating - b.rating : b.rating - a.rating;
    });

    setFilteredContent(sorted);
  }, [searchTerm, selectedTab, ratedContent, sortOrder]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'ascending' ? 'descending' : 'ascending');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="relative flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2 h-full">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <form className="flex flex-col items-start w-full pl-1" onSubmit={handleFormSubmit}>
        <div className="flex justify-between items-center w-full">
        <div className="relative flex-grow max-w-xl">
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

        <div className="bubbles-container flex justify-between mt-2 w-full">
          <div>
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
          <div className="flex items-center">
            <button
              onClick={toggleSortOrder}
              className={`flex items-center justify-center px-3 py-1.5 mt-1.5 mb-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out 
                ${'bg-[#7B1450] text-white'} 
                border-transparent border`}
            >
              {sortOrder === 'ascending' ? <FaSortAmountUp className="mr-1" /> : <FaSortAmountDown className="mr-1" />}
              Rating Sort Order
            </button>
          </div>
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
