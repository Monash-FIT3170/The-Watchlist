// imports/ui/pages/SearchBar.jsx

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../../db/List';
import Scrollbar from '../components/scrollbar/ScrollBar';
import UserList from '../components/lists/UserList';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import debounce from 'lodash.debounce';
import ListCardDisplay from '../components/lists/ListCardDisplay';
import ContentItemDisplay from '../components/contentItems/ContentItemDisplay';
import Loading from './Loading';
import { SearchContext } from '../contexts/SearchContext';
import { FaTimesCircle } from 'react-icons/fa';
import DropdownMenu from '../components/dropdowns/DropdownMenu';

const SearchBar = ({ currentUser }) => {
  const { searchState, setSearchState } = useContext(SearchContext);
  const {
    selectedTab,
    searchTerm,
    debouncedSearchTerm,
    currentPage,
    totalPages,
    filteredMovies,
    filteredTVShows,
    filteredLists,
    users,
    globalRatings,
    loading,
    selectedGenre,
    selectedLanguage,
    selectedSortOption,
  } = searchState;

  // Define genres, languages, and sorting options
  const genresList = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama',
    'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance',
    'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western',
  ];

  // **Updated Genre Items Without onClick**
  const genreItems = genresList.map(genre => ({
    id: genre, // Unique identifier
    label: genre,
    value: genre,
  }));

  // **Updated Handle Genre Select**
  const handleGenreSelect = (item) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedGenre: item.value, // Set to empty string if "All" is selected
      currentPage: 0, // Reset to first page when filter changes
    }));
  };

  const languagesList = [
    { code: 'ar', name: 'Arabic' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ca', name: 'Catalan' },
    { code: 'zh', name: 'Chinese' },
    { code: 'cs', name: 'Czech' },
    { code: 'da', name: 'Danish' },
    { code: 'nl', name: 'Dutch' },
    { code: 'en', name: 'English' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'fi', name: 'Finnish' },
    { code: 'fr', name: 'French' },
    { code: 'ka', name: 'Georgian' },
    { code: 'de', name: 'German' },
    { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' },
    { code: 'hi', name: 'Hindi' },
    { code: 'hu', name: 'Hungarian' },
    { code: 'id', name: 'Indonesian' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ko', name: 'Korean' },
    { code: 'lt', name: 'Lithuanian' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'nb', name: 'Norwegian' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fa', name: 'Persian' },
    { code: 'pl', name: 'Polish' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ro', name: 'Romanian' },
    { code: 'ru', name: 'Russian' },
    { code: 'sr', name: 'Serbian' },
    { code: 'sk', name: 'Slovak' },
    { code: 'sl', name: 'Slovenian' },
    { code: 'es', name: 'Spanish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'th', name: 'Thai' },
    { code: 'tr', name: 'Turkish' },
    { code: 'uk', name: 'Ukrainian' },
    { code: 'vi', name: 'Vietnamese' },
  ];

  // **Updated Language Items Without onClick**
  const languageItems = languagesList.map(lang => ({
    id: lang.code,
    label: lang.name,
    value: lang.code,
  }));


  const sortingOptions = [
    { value: 'title_asc', label: 'Title A-Z' },
    { value: 'title_desc', label: 'Title Z-A' },
    { value: 'release_date_desc', label: 'Release Date (Newest First)' },
    { value: 'release_date_asc', label: 'Release Date (Oldest First)' },
  ];

  // **Updated Sort Items Without onClick**
  const sortItems = sortingOptions.map(option => ({
    id: option.value,
    label: option.label,
    value: option.value,
  }));

  // **Updated Handle Language Select**
  const handleLanguageSelect = (item) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedLanguage: item.value, // Set to empty string if "All" is selected
      currentPage: 0, // Reset to first page when filter changes
    }));
  };

  // **Updated Handle Sort Option Select**
  const handleSortOptionSelect = (item) => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedSortOption: item.value, // Set to empty string if "All" is selected
      currentPage: 0, // Reset to first page when sort changes
    }));
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  // Function to check if the current user is following the given userId
  const isFollowing = (userId) => {
    const currentUser = Meteor.user();
    return (Array.isArray(currentUser.following) && (currentUser.following.includes(userId)) || currentUser._id == userId);
  };

  // Given a list, checks if the currentUser should be able to view it
  const isVisible = (list) => {
    if (list.userId == Meteor.user()._id){
      return true
    }
    if (list.visibility == "PUBLIC"){
      return true
    }
    else if (list.visibility == "FOLLOWERS" && isFollowing(list.userId)){
      return true
    }
    else {
      return false
    }
  }

  const limit = 50; // Number of items per page

  const lists = useTracker(() => {
    // Subscribe to all lists; this will be restricted to visible lists once list visibility is implemented.
    //! adjust publication if changes made below
    Meteor.subscribe('allLists');
    let returnLists = ListCollection.find(
      { 
        
        $or: 
        [
          // Grab all custom lists with public or followers visibility
          //! FIXME: to handle extra FOLLOWERS check in mongo call
          {        
            visibility: { $in: ["PUBLIC", "FOLLOWERS"] }, 
            listType: { $in: ["Custom"] }
          },
          {
            userId: { $eq: Meteor.user()._id }
          }

        ] 

        }
      
    ).fetch(); // Fetch all lists, not just the user's lists

    //! Jank. Handles FOLLOWERS visibility with following filter.
    //! Ideally, this should be handled by the mongodb call above 
    returnLists = returnLists.filter(isVisible)
    
    return returnLists
  }, []);

  useEffect(() => {
    // Fetch global ratings using the Meteor method
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (!error) {
        setSearchState((prevState) => ({
          ...prevState,
          globalRatings: result,
        }));
      } else {
        console.error('Error fetching global ratings:', error);
      }
    });
  }, []);

  // Debounce the searchTerm input
  const debouncedChangeHandler = useCallback(
    debounce((value) => {
      setSearchState((prevState) => ({
        ...prevState,
        debouncedSearchTerm: value,
        currentPage: 0, // Reset to first page on new search
      }));
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      searchTerm: value,
    }));
    debouncedChangeHandler(value);
  };

  // Event handlers for the new dropdowns
  const handleGenreChange = (e) => {
    const value = e.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      selectedGenre: value,
      currentPage: 0, // Reset to first page when filter changes
    }));
  };

  const handleLanguageChange = (e) => {
    const value = e.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      selectedLanguage: value,
      currentPage: 0, // Reset to first page when filter changes
    }));
  };

  const handleSortOptionChange = (e) => {
    const value = e.target.value;
    setSearchState((prevState) => ({
      ...prevState,
      selectedSortOption: value,
      currentPage: 0, // Reset to first page when sort changes
    }));
  };

  const handleClearFilters = () => {
    setSearchState((prevState) => ({
      ...prevState,
      selectedGenre: '',
      selectedLanguage: '',
      selectedSortOption: '',
      searchTerm: '',
      debouncedSearchTerm: '',
      currentPage: 0,
    }));
  };

  const fetchContent = useCallback(() => {
    setSearchState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    // Map selectedTab to contentType
    let contentType;
    if (selectedTab === 'Movies') {
      contentType = 'Movie';
    } else if (selectedTab === 'TV Shows') {
      contentType = 'TV Show';
    }

    const options = {
      searchString: debouncedSearchTerm,
      limit,
      page: currentPage,
      genre: selectedGenre,
      language: selectedLanguage,
      sortOption: selectedSortOption,
      contentType, // Now correctly set to 'Movie' or 'TV Show'
    };

    Meteor.call('content.read', options, (error, result) => {
      if (!error) {
        const totalItems = result.total;
        setSearchState((prevState) => ({
          ...prevState,
          loading: false,
          totalPages: Math.ceil(totalItems / limit),
          filteredMovies: selectedTab === 'Movies' ? result.content : [],
          filteredTVShows: selectedTab === 'TV Shows' ? result.content : [],
        }));
      } else {
        console.error('Error fetching content:', error);
        setSearchState((prevState) => ({
          ...prevState,
          loading: false,
          filteredMovies: [],
          filteredTVShows: [],
        }));
      }
    });
  }, [
    debouncedSearchTerm,
    currentPage,
    selectedGenre,
    selectedLanguage,
    selectedSortOption,
    selectedTab,
  ]);


  const fetchUsers = useCallback(() => {
    setSearchState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    const handle = Meteor.subscribe('allUsers', {
      onReady: () => {
        const fetchedUsers = Meteor.users
          .find({
            username: { $regex: escapeRegExp(debouncedSearchTerm), $options: 'i' },
          })
          .fetch();

        setSearchState((prevState) => ({
          ...prevState,
          loading: false,
          users: fetchedUsers,
        }));
      },
      onStop: () => {
        setSearchState((prevState) => ({
          ...prevState,
          loading: false,
        }));
      },
    });

    return () => {
      handle.stop();
    };
  }, [debouncedSearchTerm]);

  const fetchLists = useCallback(() => {
    setSearchState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    if (!debouncedSearchTerm) {
      setSearchState((prevState) => ({
        ...prevState,
        loading: false,
        filteredLists: lists,
      }));
      return;
    }

    const filtered = lists.filter(
      (list) =>
        (list.title && list.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (list.description && list.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );

    setSearchState((prevState) => ({
      ...prevState,
      loading: false,
      filteredLists: filtered,
    }));
  }, [lists, debouncedSearchTerm]);

  useEffect(() => {
    if (selectedTab === 'Movies' || selectedTab === 'TV Shows') {
      fetchContent();
    } else if (selectedTab === 'Users') {
      fetchUsers();
    } else if (selectedTab === 'Lists') {
      fetchLists();
    }
  }, [fetchContent, fetchUsers, fetchLists, debouncedSearchTerm, selectedTab, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setSearchState((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage + 1,
      }));
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setSearchState((prevState) => ({
        ...prevState,
        currentPage: prevState.currentPage - 1,
      }));
    }
  };

  const setGlobalRatings = (newRatings) => {
    setSearchState((prevState) => ({
      ...prevState,
      globalRatings: newRatings,
    }));
  };

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div className="relative flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2 h-full">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <form className="flex flex-col items-start w-full pl-1" onSubmit={(e) => e.preventDefault()}>
        <div className="flex justify-between items-center w-full max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              className="rounded-full bg-dark border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
              placeholder="Search for content, lists, or users"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <AiOutlineSearch className="text-gray-400" size={20} />
            </span>
          </div>
        </div>
        {/* Tabs and Filters */}
        <div className="flex items-center justify-between w-full mt-2">
          {/* Tabs */}
          <div className="flex">
            {['Movies', 'TV Shows', 'Lists', 'Users'].map((tab) => (
              <div
                key={tab}
                className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${selectedTab === tab
                  ? 'bg-[#7B1450] text-white border-[#7B1450]'
                  : 'bg-[#282525] text-white border-transparent'
                  } border`}
                onClick={() => {
                  setSearchState((prevState) => ({
                    ...prevState,
                    selectedTab: tab,
                    currentPage: 0, // Reset to first page when tab changes
                  }));
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Filters and Sorting Dropdowns */}
          {(selectedTab === 'Movies' || selectedTab === 'TV Shows') && (
            <div className="flex items-center">
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

              {/* Language Dropdown */}
              <div className="mr-4 mb-2">
                <DropdownMenu
                  defaultText="All Languages"
                  allText="All Languages"
                  items={languageItems}
                  onSelect={handleLanguageSelect}
                  selectedValue={selectedLanguage}
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
          )}
        </div>


      </form>
      <Scrollbar className="search-results-container flex-grow overflow-auto">
        <>
          {selectedTab === 'Movies' && (
            <ContentItemDisplay
              contentItems={filteredMovies}
              contentType="Movie"
              globalRatings={globalRatings}
              setGlobalRatings={setGlobalRatings}
            />
          )}
          {selectedTab === 'TV Shows' && (
            <ContentItemDisplay
              contentItems={filteredTVShows}
              contentType="TV Show"
              globalRatings={globalRatings}
              setGlobalRatings={setGlobalRatings}
            />
          )}
          {selectedTab === 'Lists' &&
            (filteredLists.length > 0 ? (
              <ListCardDisplay lists={filteredLists} />
            ) : debouncedSearchTerm === '' ? (
              <div className="flex justify-center items-center w-full h-full">
                <img src="/images/popcorn.png" alt="No Lists" className="w-32 h-32" />
              </div>
            ) : (
              <div className="text-center text-gray-400">No lists found.</div>
            ))}

          {selectedTab === 'Users' &&
            (users.length > 0 ? (
              <UserList users={users} searchTerm={debouncedSearchTerm} currentUser={currentUser} />
            ) : debouncedSearchTerm === '' ? (
              <div className="flex justify-center items-center w-full h-full">
                <img src="/images/popcorn.png" alt="No Users" className="w-32 h-32" />
              </div>
            ) : (
              <div>No users found.</div>
            ))}
        </>
      </Scrollbar>

      {/* Pagination buttons */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className={`py-2 px-4 rounded-lg ${currentPage === 0 ? 'bg-gray-300' : 'bg-[#7B1450] text-white'}`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className={`py-2 px-4 rounded-lg ${currentPage >= totalPages - 1 ? 'bg-gray-300' : 'bg-[#7B1450] text-white'
              }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;