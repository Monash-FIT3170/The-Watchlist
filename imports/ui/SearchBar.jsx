import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import ContentItem from './ContentItem';
import ListDisplay from './ListDisplay';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import Scrollbar from './ScrollBar';  // Import the Scrollbar component
import UserList from './UserList';
import ProfileDropdown from './ProfileDropdown';

const SearchBar = ({ currentUser }) => {

    const [selectedTab, setSelectedTab] = useState('movies');
    const [searchTerm, setSearchTerm] = useState('');
    const [globalRatings, setGlobalRatings] = useState({});
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [filteredTVShows, setFilteredTVShows] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const limit = 50; // Number of items per page

    // Fetch lists directly from the database using useTracker
    const fetchLists = useCallback(() => {
        const userId = Meteor.userId();
        Meteor.subscribe('userLists', userId);
        return ListCollection.find({ userId }).fetch();
    }, []);

    const lists = useTracker(fetchLists, []);

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

    const fetchUsers = useCallback(() => {
        Meteor.subscribe('allUsers');
        return Meteor.users.find({
            username: { $regex: searchTerm, $options: 'i' }
        }).fetch();
    }, [searchTerm]);

    const users = useTracker(fetchUsers, [searchTerm]);

    const fetchContent = useCallback(() => {
        Meteor.call('content.read', { searchString: searchTerm, limit, page: currentPage }, (error, result) => {
            if (!error) {
                console.log("Content read result:", result);  // Log the full result
    
                // Calculate the total number of pages using the lengths of the arrays
                const totalItems = result.total;

                setTotalPages(Math.ceil(totalItems / limit));
    
                setFilteredMovies(result.movie || []); // Set to empty array if undefined
                setFilteredTVShows(result.tv || []); // Set to empty array if undefined
            } else {
                console.error("Error fetching content:", error);
                setFilteredMovies([]); // Ensure arrays are never undefined
                setFilteredTVShows([]); // Ensure arrays are never undefined
            }
        });
    }, [searchTerm, currentPage]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
        setCurrentPage(0);
    };

    useEffect(() => {
        console.log("Filtered Movies updated:", filteredMovies);
    }, [filteredMovies]);    

    const handleNextPage = () => {
        console.log("Next clicked")
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => {
                console.log("Next Page:", prevPage + 1);
                return prevPage + 1;
            });
        }
    };
    
    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => {
                console.log("Previous Page:", prevPage - 1);
                return prevPage - 1;
            });
        }
    };
    

    const filteredLists = lists.filter(list =>
        (list.title && list.title.toLowerCase().includes(searchTerm)) ||
        (list.description && list.description.toLowerCase().includes(searchTerm))
    );

    return (
        <div className="relative flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2 h-full">
            <div className="absolute top-4 right-4">
                <ProfileDropdown user={currentUser} />
            </div>
            <form className="flex flex-col items-start w-full pl-1">
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
                    {['movies', 'tv shows', 'lists', 'users'].map((tab) => (
                        <div
                            key={tab}
                            className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${selectedTab === tab ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'
                                } border-transparent border`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </div>
                    ))}
                </div>
            </form>
            <Scrollbar className="search-results-container flex-grow overflow-auto">
    {selectedTab === 'movies' && (
        <div className="grid-responsive">
            {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                <ContentItem content={movie} key={movie.contentId} />
            )) : <div>No movies available.</div>}
        </div>
    )}
    {selectedTab === 'tv shows' && (
        <div className="grid-responsive">
            {filteredTVShows.length > 0 ? filteredTVShows.map(tv => (
                <ContentItem content={tv} key={tv.contentId} />
            )) : <div>No TV shows available.</div>}
        </div>
    )}
    {selectedTab === 'lists' && (
        filteredLists.length > 0 ? (
            <ListDisplay listData={filteredLists} />
        ) : (
            <div>No lists available.</div>
        )
    )}
    {selectedTab === 'users' && (
        users.length > 0 ? (
            <UserList users={users} searchTerm={searchTerm} currentUser={currentUser} />
        ) : (
            <div>No users found.</div>
        )
    )}
</Scrollbar>


            {/* Pagination buttons */}
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
        </div>
    );
};

export default SearchBar;
