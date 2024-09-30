// imports/ui/pages/SharedWatchlistPage.jsx

import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SharedWatchlistHeader from '../components/headers/SharedWatchlistHeader';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ContentItem from '../components/contentItems/ContentItem';
import Loading from './Loading';
import DropdownMenu from '../components/dropdowns/DropdownMenu';
import { FaTimesCircle } from 'react-icons/fa';

const SharedWatchlistPage = ({ currentUser }) => {
  const { listId } = useParams();
  const [list, setList] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const navigate = useNavigate();

  const tabMapping = {
    All: 'All',
    Movies: 'Movie',
    'TV Shows': 'TV Show',
  };

  // Define genres and sorting options
  const genresList = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama',
    'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
    'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western',
  ];

  const sortingOptions = [
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'release_date_desc', label: 'Release Date (Newest First)' },
    { value: 'release_date_asc', label: 'Release Date (Oldest First)' },
  ];

  // Create items for DropdownMenu components
  const genreItems = genresList.map((genre) => ({
    id: genre,
    label: genre,
    value: genre,
  }));

  const sortItems = sortingOptions.map((option) => ({
    id: option.value,
    label: option.label,
    value: option.value,
  }));

  // Event handlers for DropdownMenu selections
  const handleGenreSelect = (item) => {
    setSelectedGenre(item.value);
  };

  const handleSortOptionSelect = (item) => {
    setSelectedSortOption(item.value);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedSortOption('');
  };

  // Helper functions for sorting and retrieving content properties
  const getTitle = (content) => {
    return content.title || content.name || '';
  };

  const getReleaseDate = (content) => {
    return content.release_date || content.first_air_date || '1970-01-01';
  };

  const sortContent = (contentArray, sortOption) => {
    const sorted = [...contentArray];
    switch (sortOption) {
      case 'title_asc':
        sorted.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
        break;
      case 'title_desc':
        sorted.sort((a, b) => getTitle(b).localeCompare(getTitle(a)));
        break;
      case 'release_date_asc':
        sorted.sort((a, b) => new Date(getReleaseDate(a)) - new Date(getReleaseDate(b)));
        break;
      case 'release_date_desc':
        sorted.sort((a, b) => new Date(getReleaseDate(b)) - new Date(getReleaseDate(a)));
        break;
      default:
        break;
    }
    return sorted;
  };

  // Fetch the list by listId
  useEffect(() => {
    if (listId) {
      Meteor.call('list.getById', listId, (err, result) => {
        setLoading(false);
        if (err) {
          console.error('Error fetching list:', err);
          setList(null);
        } else {
          setList(result);
        }
      });
    }
  }, [listId]);

  // Filter and sort content based on selected options
  useEffect(() => {
    if (!loading && list) {
      let filtered = list.content.filter((content) => {
        const matchesTab =
          selectedTab === 'All' || content.contentType === tabMapping[selectedTab];
        const matchesGenre =
          selectedGenre === '' ||
          (content.genres && content.genres.includes(selectedGenre));
        return matchesTab && matchesGenre;
      });

      // Apply sorting
      if (selectedSortOption) {
        filtered = sortContent(filtered, selectedSortOption);
      }

      setFilteredContent(filtered);
    }
  }, [selectedTab, selectedGenre, selectedSortOption, list, loading]);

  if (loading) return <Loading />;

  // if (!currentUser) {
  //     // Redirect to login page if user is not logged in
  //     navigate("/login");
  //     return;
  // }

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <SharedWatchlistHeader
        list={list}
        tabMapping={tabMapping}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        currentUser={currentUser}
      />

      {/* Filters and Sorting */}
      <div className="flex items-center justify-between w-full mt-2 px-4">
        {/* Tabs */}
        {/* <div className="flex">
          {Object.keys(tabMapping).map((tab) => (
            <div
              key={tab}
              className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${
                selectedTab === tab
                  ? 'bg-[#7B1450] text-white border-[#7B1450]'
                  : 'bg-[#282525] text-white border-transparent'
              } border`}
              onClick={() => {
                setSelectedTab(tab);
              }}
            >
              {tab}
            </div>
          ))}
        </div> */}

        {/* Filters and Sorting Dropdowns */}
        <div className="flex items-center justify-end w-full mt-2 px-4">
          {/* Genres Dropdown */}
          <div className="mr-4 mb-2">
            <DropdownMenu
              defaultText="All Genres"
              allText="All Genres"
              items={genreItems}
              onSelect={handleGenreSelect}
              selectedValue={selectedGenre}
            />
          </div>

          {/* Sorting Dropdown */}
          <div className="mr-4 mb-2">
            <DropdownMenu
              defaultText="Sort By"
              allText="Sort By"
              items={sortItems}
              onSelect={handleSortOptionSelect}
              selectedValue={selectedSortOption}
            />
          </div>

          {/* Clear Filters Icon */}
          <div className="mb-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-dark text-white p-2 rounded-full hover:bg-[#5a0e3c] focus:outline-none focus:ring-2 focus:ring-[#5a0e3c]"
              title="Clear Filters"
            >
              <FaTimesCircle className="text-gray-400" size={20} />
            </button>
          </div>
        </div>
      </div>

      <Scrollbar className="search-results-container flex-grow overflow-auto px-4">
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,_200px)] justify-between items-center">
          {filteredContent.length > 0 ? (
            filteredContent.map((content, index) => (
              <ContentItem
                key={index}
                content={content}
                isUserSpecificRating={false}
                contentType={content.contentType}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 mt-2">No content available.</p>
          )}
        </div>
      </Scrollbar>
    </div>
  );
};

export default SharedWatchlistPage;
