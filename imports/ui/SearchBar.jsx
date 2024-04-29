import React, { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineDown } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

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
        movies: [],
        tvShows: [],
        users: [],
        lists: []
    });

    const data = {
        movies: [
            { id: 1, name: "Movie 1", year: "2022", genre: "Action" },
            { id: 2, name: "Movie 2", year: "2023", genre: "Comedy" },
            { id: 3, name: "Movie 3", year: "2021", genre: "Drama" }
        ],
        tvShows: [
            { id: 1, name: "TV Show 1", year: "2022", genre: "Drama" },
            { id: 2, name: "TV Show 2", year: "2023", genre: "Action" },
            { id: 3, name: "TV Show 3", year: "2021", genre: "Comedy" }
        ],
        users: [
            { id: 1, name: "User 1", activeSince: "2021" },
            { id: 2, name: "User 2", activeSince: "2022" },
            { id: 3, name: "User 3", activeSince: "2023" }
        ],
        lists: [
            { id: 1, name: "List 1", items: 10 },
            { id: 2, name: "List 2", items: 15 },
            { id: 3, name: "List 3", items: 5 }
        ]
    };

    const filterData = (category, filters) => {
        let filteredData = data[category];
        if (filters.date.selected) {
            filteredData = filteredData.filter(item => item.year === filters.date.selected);
        }
        if (filters.genre.selected && (category === 'movies' || category === 'tvShows')) {
            filteredData = filteredData.filter(item => item.genre === filters.genre.selected);
        }
        return filteredData;
    };

    const toggleDropdown = (tab) => {
        setDropdownOpen(dropdownOpen === tab ? null : tab);
    };

    const handleSelection = (tab, option) => {
        const newState = { ...dropdownStates, [tab]: { ...dropdownStates[tab], selected: option } };
        setDropdownStates(newState);
        setDropdownOpen(null);
    };

    const handleRemoveFilter = (filterKey) => {
        const newState = { ...dropdownStates, [filterKey]: { ...dropdownStates[filterKey], selected: '' } };
        setDropdownStates(newState);
    };

    const handleClearFilters = () => {
        setDropdownStates({
            date: { ...dropdownData.date, selected: '' },
            genre: { ...dropdownData.genre, selected: '' },
            filter3: { ...dropdownData.filter3, selected: '' }
        });
    };

    useEffect(() => {
        updateFilters();
    }, [dropdownStates]);

    const updateFilters = () => {
        setFilteredData({
            movies: filterData('movies', dropdownStates),
            tvShows: filterData('tvShows', dropdownStates),
            users: filterData('users', dropdownStates),
            lists: filterData('lists', dropdownStates)
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
                            onChange={(e) => setSearchTerm(e.target.value)}
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
                {showFilters && (
                    <div className="filter-tabs-container flex justify-start mt-2">
                        {Object.keys(dropdownStates).map((tab) => (
                            <div key={tab} className={`px-4 py-2 cursor-pointer ${dropdownOpen === tab ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => toggleDropdown(tab)}>
                                <span className="flex items-center">
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    <AiOutlineDown className="ml-1" size={16} />
                                </span>
                                {dropdownOpen === tab && (
                                    <div className="dropdown-menu absolute mt-1 bg-white border border-gray-300 shadow-lg">
                                        <ul>
                                            {dropdownStates[tab].options.map((option, index) => (
                                                <li key={index} className="p-2 hover:bg-gray-100" onClick={() => handleSelection(tab, option)}>
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </form>

            {/* Display Filter Tags and Clear All Button */}
            <div className="filter-tags">
                {Object.entries(dropdownStates).filter(([_, value]) => value.selected).map(([key, value]) => (
                    <div key={key} className="tag bg-dark">
                        {`${key}: ${value.selected}`}
                        <button onClick={() => handleRemoveFilter(key)}>×</button>
                    </div>
                ))}
                {Object.values(dropdownStates).some(value => value.selected) && (
                    <button className="tag bg-dark" onClick={handleClearFilters}>Clear All Filters</button>
                )}
            </div>


            {/* Display Filtered Data */}
            <div>
                {selectedTab === 'movies' && (filteredData.movies.length > 0 ? filteredData.movies.map(movie => (
                    <div key={movie.id}>{movie.name}</div>
                )) : <div>No movies available.</div>)}
                {selectedTab === 'tv shows' && (filteredData.tvShows.length > 0 ? filteredData.tvShows.map(tvShow => (
                    <div key={tvShow.id}>{tvShow.name}</div>
                )) : <div>No TV shows available.</div>)}
                {selectedTab === 'users' && (filteredData.users.length > 0 ? filteredData.users.map(user => (
                    <div key={user.id}>{user.name}</div>
                )) : <div>No users available.</div>)}
                {selectedTab === 'lists' && (filteredData.lists.length > 0 ? filteredData.lists.map(list => (
                    <div key={list.id}>{list.name}</div>
                )) : <div>No lists available.</div>)}
            </div>
        </div>
    );
};

export default SearchBar;