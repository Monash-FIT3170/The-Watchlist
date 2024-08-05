import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import ContentItem from './ContentItem';
import ListDisplay from './ListDisplay';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import Scrollbar from './ScrollBar';  // Import the Scrollbar component
import UserList from './UserList';
import ProfileDropdown from './ProfileDropdown';
import { getImageUrl } from './imageUtils';

const SearchBar = ({ movies, tvs, currentUser }) => {
    console.log('Component render');

    // Fetch lists directly from the database using useTracker
    const fetchLists = useCallback(() => {
        const userId = Meteor.userId();
        Meteor.subscribe('userLists', userId);
        return ListCollection.find({ userId }).fetch();
    }, []);

    const [selectedTab, setSelectedTab] = useState('movies');

    const lists = useTracker(fetchLists, []);

    const [searchTerm, setSearchTerm] = useState('');
    const [globalRatings, setGlobalRatings] = useState({});

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredMovies = movies.map(movie => ({
        ...movie,
        rating: globalRatings[movie.id]?.average || 0
    })).filter(movie =>
        movie.title && movie.title.toLowerCase().includes(searchTerm)
    );

    const filteredTVShows = tvs.map(tv => ({
        ...tv,
        rating: globalRatings[tv.id]?.average || 0
    })).filter(tv =>
        tv.title && tv.title.toLowerCase().includes(searchTerm)
    );

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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                            <ContentItem key={movie.id} id={movie.id} type="Movie" src={movie.image_url} alt={movie.title} rating={movie.rating} />
                        )) : <div>No movies available.</div>}
                    </div>
                )}
                {selectedTab === 'tv shows' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredTVShows.length > 0 ? filteredTVShows.map(tv => (
                            <ContentItem key={tv.id} id={tv.id} type="TV Show" src={getImageUrl(tv.image_url)} alt={tv.title} rating={tv.rating || undefined} />
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
        </div>
    );
};

export default SearchBar;
