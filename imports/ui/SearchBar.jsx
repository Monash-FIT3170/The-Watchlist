import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineDown } from 'react-icons/ai';
import dummyMovies from './DummyMovies';
import dummyTVs from './DummyTvs';
import ContentItem from './ContentItem';
import dummyLists from './DummyLists';
import CustomWatchLists from './CustomWatchLists';
import ListDisplay from './ListDisplay';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('movies');
    const [showFilters, setShowFilters] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownData = {
        date: {
            options: ["2023", "2022", "2021"],
            selected: ""
        },
        genre: {
            options: ["Action", "Comedy", "Drama"],
            selected: ""
        },
        filter3: {
            options: ["Option 1", "Option 2", "Option 3"],
            selected: ""
        }
    };
    const [dropdownStates, setDropdownStates] = useState(dropdownData);
    const [filteredData, setFilteredData] = useState({
        movies: dummyMovies,
        tvShows: dummyTVs,
        users: [], // there will be a similar dummy data array for users
        lists: dummyLists  // there will be a similar dummy data array for lists
    });

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        if (!value) {
            setFilteredData({
                movies: dummyMovies,
                tvShows: dummyTVs,
                users: [], // Reset or update according to available user data
                lists: dummyLists
            });
        } else {
            const filterContent = (item) => item.title.toLowerCase().includes(value);
            const filterLists = (list) => list.title.toLowerCase().includes(value) || list.description.toLowerCase().includes(value);

            setFilteredData({
                movies: dummyMovies.filter(filterContent),
                tvShows: dummyTVs.filter(filterContent),
                users: [], // Filter user data
                lists: dummyLists.filter(filterLists)
            });
        }
    };


    return (
        <div className="flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2 h-full">
            <form className="flex flex-col items-start w-full pl-2">
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
                    <button
                        type="button"
                        className="ml-4"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <AiOutlineFilter size={20} />
                    </button>
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
                {/* Additional UI for filters could be here */}
            </form>

            {/* Display Filtered Data */}
            <div className="search-results-container flex flex-grow overflow-auto">
                {selectedTab === 'movies' && (filteredData.movies.length > 0 ? filteredData.movies.map(movie => (
                    <ContentItem key={movie.id} id={movie.id} type="movie" src={movie.image_url} alt={movie.title} rating={movie.rating} />
                )) : <div>No movies available.</div>)}

                {selectedTab === 'tv shows' && (filteredData.tvShows.length > 0 ? filteredData.tvShows.map(tv => (
                    <ContentItem key={tv.id} id={tv.id} type="tv" src={tv.image_url} alt={tv.title} rating={tv.rating || undefined} /> // Assume TV shows may not always have ratings
                )) : <div>No TV shows available.</div>)}

                {selectedTab === 'lists' && (filteredData.lists.length > 0 ?
                    <ListDisplay listData={filteredData.lists} />
                    : <div>No lists available.</div>)
                }
            </div>
        </div>
    );
};

export default SearchBar;
