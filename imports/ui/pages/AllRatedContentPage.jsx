import React, { useState, useEffect } from 'react'; // Import React and hooks
import { useParams } from 'react-router-dom'; // Import hook for accessing route parameters
import { Meteor } from 'meteor/meteor'; // Import Meteor for server calls
import { useTracker } from 'meteor/react-meteor-data'; // Import hook to reactively fetch data from Meteor
import Scrollbar from '../components/scrollbar/ScrollBar'; // Import custom scrollbar component
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown'; // Import ProfileDropdown component
import ContentItem from '../components/contentItems/ContentItem'; // Import ContentItem component
import { RatingCollection } from '../../db/Rating'; // Import Rating Collection from the database
import { MovieCollection, TVCollection } from '../../db/Content'; // Import content collections
import { AiOutlineSearch } from 'react-icons/ai'; // Import search icon from react-icons
import { FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa'; // Import sort icons

const AllRatedContentPage = ({ currentUser }) => {
  // Extract userId from the URL parameters
  const { userId } = useParams();

  // State for managing search term, tab selection, content filtering, and sort order
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');
  const [filteredContent, setFilteredContent] = useState([]);
  const [sortOrder, setSortOrder] = useState('descending'); // Default to descending sort order

  // Use search parameters to determine if it's user-specific
  const searchParams = new URLSearchParams(window.location.search);
  const userSpecific = searchParams.get('userSpecific') === 'true';

  // Mapping tabs to their respective content types
  const tabMapping = {
    All: 'All',
    Movies: 'Movie',
    'TV Shows': 'TV Show',
    Seasons: 'Season',
  };

  // Reactive Tracker to fetch the rated content based on user
  const { ratedContent, isLoading } = useTracker(() => {
    const ratingsHandle = Meteor.subscribe('userRatings', userId); // Subscribe to user's ratings

    // Log subscription readiness
    console.log("ratingsHandle.ready():", ratingsHandle.ready());

    // Log user information
    console.log("userId:", userId);
    console.log("userSpecific:", userSpecific);
    console.log("currentUser._id:", currentUser._id);

    // Fetch ratings based on whether the page is user-specific or not
    const ratings = userSpecific
      ? RatingCollection.find({ userId: currentUser._id }).fetch()
      : RatingCollection.find({ userId }).fetch();

    // Log ratings
    console.log("ratings:", ratings);

    // Group content IDs by content type
    const contentIdsByType = ratings.reduce((acc, rating) => {
      const contentTypeKey = rating.contentType === 'Movie' ? 'Movie' : 'TV Show';
      if (!acc[contentTypeKey]) {
        acc[contentTypeKey] = new Set();
      }
      acc[contentTypeKey].add(rating.contentId);
      return acc;
    }, {});

    // Log content IDs by type
    console.log("contentIdsByType:", contentIdsByType);

    // Subscribe to content IDs per content type
    const contentSubscriptions = Object.entries(contentIdsByType).map(([contentType, ids]) => {
      const subscription = Meteor.subscribe('contentByIds', Array.from(ids), contentType);
      console.log(`Subscribed to contentByIds for contentType: ${contentType}, ids:`, Array.from(ids));
      console.log(`Subscription ready: ${subscription.ready()}`);
      return subscription;
    });

    // Map the ratings to corresponding content
    const contentDetails = ratings.map(rating => {
      let content = null;
      if (rating.contentType === 'Movie') {
        content = MovieCollection.findOne({ contentId: rating.contentId });
      } else if (rating.contentType === 'TV Show' || rating.contentType === 'Season') {
        content = TVCollection.findOne({ contentId: rating.contentId });
      }

      // If the content is a season, adjust the title and structure
      if (content && rating.contentType === 'Season') {
        content = {
          ...content,
          title: `${content.title} - Season ${rating.seasonId}`,
          contentType: 'Season', // Set contentType to 'Season'
          originalContentType: 'Season',
          seasonId: rating.seasonId, // Include seasonId for unique key
        };
      }
      // Ensure contentType is set for non-season content
      else if (content) {
        content.contentType = rating.contentType; // Ensure contentType is set
        content.originalContentType = rating.contentType;
      }

      // Return content with rating, filtered by valid title
      return content ? {
        ...content,
        rating: Number(rating.rating), // Ensure rating is a number
        contentType: content.contentType || rating.contentType,
        originalContentType: content.originalContentType || rating.contentType,
      } : null;
    }).filter(content => content && content.title);  // Filter out content without titles

    // Log content details
    console.log("contentDetails:", contentDetails);

    // Check if all subscriptions are ready
    const allSubscriptionsReady = ratingsHandle.ready() && contentSubscriptions.every(sub => sub.ready());

    // Log if all subscriptions are ready
    console.log("allSubscriptionsReady:", allSubscriptionsReady);

    return {
      ratedContent: contentDetails,
      isLoading: !allSubscriptionsReady,  // Indicate loading state
    };
  }, [userId, currentUser._id, userSpecific]);

  // Filter and sort content whenever search term, tab, or rated content changes
  useEffect(() => {
    const filtered = ratedContent.filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());  // Search by title
      const matchesTab = selectedTab === 'All'
        ? content.contentType === 'Movie' || content.originalContentType === 'TV Show'  // Show movies and shows for "All"
        : content.originalContentType === tabMapping[selectedTab];  // Match selected tab content type
      return matchesSearch && matchesTab;
    });

    // Log ratings for debugging
    console.log('Before sorting, ratings are:', filtered.map(c => ({ title: c.title, rating: c.rating })));

    // Sort content by rating based on sortOrder
    const sorted = filtered.sort((a, b) => {
      return sortOrder === 'ascending' ? a.rating - b.rating : b.rating - a.rating;
    });

    setFilteredContent(sorted);  // Update filtered content
  }, [searchTerm, selectedTab, ratedContent, sortOrder]);

  // Handle changes in search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Toggle sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => prevOrder === 'ascending' ? 'descending' : 'ascending');
  };

  // Prevent form submission default behavior
  const handleFormSubmit = (e) => {
    e.preventDefault();
  };

  // Log filtered content length before rendering
  console.log("filteredContent.length:", filteredContent.length);

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
      <div className="grid gap-4 grid-cols-[repeat(auto-fill,_200px)] justify-between items-center px-2 py-2">
          {filteredContent.length > 0 ? filteredContent.map((content) => (
            <ContentItem
              key={
                content.originalContentType === 'Season'
                  ? `Season-${content.contentId}-${content.seasonId}`
                  : `${content.contentType}-${content.contentId}`
              }
              content={content}
              isUserSpecificRating={userSpecific}
              contentType={content.contentType} // This will be 'Season' for seasons
            />
          )) : <p>No rated content available.</p>}
        </div>
      </Scrollbar>
    </div>
  );
};

export default AllRatedContentPage;
