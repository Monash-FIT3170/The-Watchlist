import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineDown } from 'react-icons/ai';
import { dummyMovies } from './DummyMovies';
import { dummyTVs } from './DummyTvs';
import ContentItem from './ContentItem'; // Adjust the path if necessary


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
        lists: []  // there will be a similar dummy data array for lists
    });

    const handleSearchChange = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filter = (item) => item.title.toLowerCase().includes(value);

        setFilteredData({
            movies: dummyMovies.filter(filter),
            tvShows: dummyTVs.filter(filter),
            users: [], // Apply similar logic with user data
            lists: []  // Apply similar logic with list data
        });
    };

    return (
        <div className="search-bar-container">
            <form className="flex flex-col items-start w-full">
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
                    {['movies', 'tv shows', 'users', 'lists'].map((tab) => (
                        <div
                            key={tab}
                            className={`bubble ${selectedTab === tab ? 'bubble-active' : 'bg-dark'}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </div>
                    ))}
                </div>
                {/* Additional UI for filters could be here */}
            </form>

            {/* Display Filtered Data */}
            <div className="search-results-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {selectedTab === 'movies' && (filteredData.movies.length > 0 ? filteredData.movies.map(movie => (
                    <ContentItem key={movie.id} src={movie.image_url} alt={movie.title} rating={movie.rating} />
                )) : <div>No movies available.</div>)}

                {selectedTab === 'tv shows' && (filteredData.tvShows.length > 0 ? filteredData.tvShows.map(tv => (
                    <ContentItem key={tv.id} src={tv.image_url} alt={tv.title} rating={tv.rating || undefined} /> // Assume TV shows may not always have ratings
                )) : <div>No TV shows available.</div>)}

                {/* Similarly for users and lists */}
            </div>
        </div>
    );
};

export default SearchBar;
