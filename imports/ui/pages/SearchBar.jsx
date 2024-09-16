import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import ContentItem from '../components/contentItems/ContentItem';
import ListDisplay from '../components/lists/ListDisplay';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../../db/List';
import Scrollbar from '../components/scrollbar/ScrollBar';
import UserList from '../components/lists/UserList';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import debounce from 'lodash.debounce';

const SearchBar = ({ currentUser }) => {

    const [selectedTab, setSelectedTab] = useState('Movies');
    const [searchTerm, setSearchTerm] = useState('');
    const [globalRatings, setGlobalRatings] = useState({});
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [filteredTVShows, setFilteredTVShows] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

  const limit = 50; // Number of items per page

  const lists = useTracker(() => {
    const userId = Meteor.userId();
    Meteor.subscribe('userLists', userId);
    return ListCollection.find({ userId }).fetch();
  }, []);

  useEffect(() => {
    // Fetch global ratings using the Meteor method
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (!error) {
        setGlobalRatings(result);
      } else {
        console.error("Error fetching global ratings:", error);
      }
    });
  }, []);

  // Debounce the searchTerm input
  const debouncedChangeHandler = useCallback(
    debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(0); // Reset to first page on new search
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedChangeHandler(e.target.value);
  };

  const fetchContent = useCallback(() => {
    setLoading(true);
    const options = { searchString: debouncedSearchTerm, limit, page: currentPage };

    Meteor.call('content.read', options, (error, result) => {
      setLoading(false);
      if (!error) {
        const totalItems = result.total;
        setTotalPages(Math.ceil(totalItems / limit));
        setFilteredMovies(result.movie?.map(movie => ({ ...movie, contentType: 'Movie' })) || []);
        setFilteredTVShows(result.tv?.map(tv => ({ ...tv, contentType: 'TV Show' })) || []);
      } else {
        console.error("Error fetching content:", error);
        setFilteredMovies([]);
        setFilteredTVShows([]);
      }
    });
  }, [debouncedSearchTerm, currentPage]);

    const fetchUsers = useCallback(() => {
        Meteor.subscribe('allUsers');
        return Meteor.users.find({
            username: { $regex: escapeRegExp(searchTerm), $options: 'i' }
        }).fetch();
        setUsers(fetchedUsers);
      },
      onStop: () => {
        setLoading(false);
      }
    });
  }, [debouncedSearchTerm]);

  const fetchLists = useCallback(() => {
    if (!debouncedSearchTerm) {
      setFilteredLists(lists);
      return;
    }
    const filtered = lists.filter(list =>
      (list.title && list.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
      (list.description && list.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
    );
    setFilteredLists(filtered);
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
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

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
        <div className="bubbles-container flex justify-end mt-2">
          {['Movies', 'TV Shows', 'Lists', 'Users'].map((tab) => (
            <div
              key={tab}
              className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${selectedTab === tab ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'
                } border-transparent border`}
              onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(0); // Reset to first page when tab changes
              }}
            >
              {tab}
            </div>
          ))}
        </div>
      </form>
      <Scrollbar className="search-results-container flex-grow overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            {selectedTab === 'Movies' && (
              <div className="grid-responsive">
                {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                  <ContentItem content={movie} contentType="Movie" key={movie.contentId} globalRating={globalRatings[movie.contentId]?.average || 0} setGlobalRatings={setGlobalRatings} />
                )) : debouncedSearchTerm === '' ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <img src="/images/popcorn.png" alt="No Movies" className="w-32 h-32" />
                  </div>
                ) : (
                  <div>No movies found.</div>
                )}
              </div>
            )}
            {selectedTab === 'TV Shows' && (
              <div className="grid-responsive">
                {filteredTVShows.length > 0 ? filteredTVShows.map(tv => (
                  <ContentItem content={tv} contentType="TV Show" key={tv.contentId} globalRating={globalRatings[tv.contentId]?.average || 0} setGlobalRatings={setGlobalRatings} />
                )) : debouncedSearchTerm === '' ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <img src="/images/popcorn.png" alt="No TV Shows" className="w-32 h-32" />
                  </div>
                ) : (
                  <div>No TV shows found.</div>
                )}
              </div>
            )}
            {selectedTab === 'Lists' && (
              filteredLists.length > 0 ? (
                <ListDisplay listData={filteredLists} />
              ) : debouncedSearchTerm === '' ? (
                <div className="flex justify-center items-center w-full h-full">
                  <img src="/images/popcorn.png" alt="No Lists" className="w-32 h-32" />
                </div>
              ) : (
                <div>No lists found.</div>
              )
            )}
            {selectedTab === 'Users' && (
              users.length > 0 ? (
                <UserList users={users} searchTerm={debouncedSearchTerm} currentUser={currentUser} />
              ) : debouncedSearchTerm === '' ? (
                <div className="flex justify-center items-center w-full h-full">
                  <img src="/images/popcorn.png" alt="No Users" className="w-32 h-32" />
                </div>
              ) : (
                <div>No users found.</div>
              )
            )}
          </>
        )}
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
            className={`py-2 px-4 rounded-lg ${currentPage >= totalPages - 1 ? 'bg-gray-300' : 'bg-[#7B1450] text-white'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
