import React, { useState, useEffect } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineDown } from 'react-icons/ai';
import dummyMovies from './DummyMovies';
import dummyTVs from './DummyTvs';
import ContentItem from './ContentItem';
import dummyLists from './DummyLists';
import ListDisplay from './ListDisplay';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('movies');
    const [showFilters, setShowFilters] = useState(false);

    const dropdownData = {
        year: {
            options: [2023, 2022, 2021, 2020],
            selected: []
        },
        genres: {
            options: [
                "Action", "Adventure", "Animation", "Anime", "Awards Show", "Children",
                "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Food",
                "Game Show", "History", "Home and Garden", "Horror", "Indie", "Martial Arts",
                "Mini-Series", "Musical", "Mystery", "News", "Podcast", "Reality",
                "Romance", "Science Fiction", "Soap", "Sport", "Suspense", "Talk Show",
                "Thriller", "Travel", "War", "Western"
            ],
            selected: []
        },

        sortBy: {
            options: ["rating", "runtime"],
            selected: "" // this is string as opposed to arrays above due to lack of multi-select
        }
    };

    const [filters, setFilters] = useState(dropdownData);

    const handleRemoveFilter = (filterKey) => {
        // Directly reset the selected values based on the expected data type
        if (Array.isArray(filters[filterKey].selected)) {
            // If it's an array (e.g., genres), reset to an empty array
            setFilters(prev => ({ ...prev, [filterKey]: { ...prev[filterKey], selected: [] } }));
        } else {
            // If it's a single-select (e.g., sortBy), reset to the default or empty string
            setFilters(prev => ({ ...prev, [filterKey]: { ...prev[filterKey], selected: '' } }));
        }
    };



    const handleClearFilters = () => {
        setFilters({
            year: { ...filters.year, selected: [] },
            genres: { ...filters.genres, selected: [] },
            sortBy: { ...filters.sortBy, selected: '' }
        });
    };

    const handleFilterChange = (filterType, value) => {
        console.log("handleFilterChange called");
        console.log("Current Filters State:", filters);
        console.log("Filter Type:", filterType);
        console.log("Filters Object for Type:", filters[filterType]);  // Add this to check if it's defined
        if (filters[filterType] && Array.isArray(filters[filterType].selected)) {  // Also check if filters[filterType] is defined
            const updatedSelected = filters[filterType].selected.includes(value)
                ? filters[filterType].selected.filter(item => item !== value)
                : [...filters[filterType].selected, value];
            setFilters(prev => ({ ...prev, [filterType]: { ...prev[filterType], selected: updatedSelected } }));
        } else if (filters[filterType]) {  // Handle single-select options safely
            setFilters(prev => ({ ...prev, [filterType]: { ...prev[filterType], selected: value } }));
        } else {
            console.error("Filter type is undefined:", filterType);
        }
    };


    const FilterDropdown = ({ label, options, selected }) => {
        const [dropdownOpen, setDropdownOpen] = useState(false);
        return (
            <div className="relative bg-dark text-white text-xs rounded-lg">
                <button
                    type="button"
                    className="bg-dark px-4 py-2 rounded-md flex items-center justify-between w-full"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                    {label}
                    <AiOutlineDown className="ml-2 h-3 w-3" aria-hidden="true" />
                </button>
                {dropdownOpen && (
                    <div className="absolute left-0 mt-1 w-full rounded-md shadow-lg bg-gray-900 z-50 overflow-auto max-h-60">
                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            {options.map(option => (
                                <a
                                    key={option}
                                    className={`block px-4 py-2 text-sm hover:bg-gray-700 ${selected.includes(option) ? 'font-bold bg-gray-700' : 'bg-transparent'}`}
                                    onClick={() => handleFilterChange(label, option)}
                                    role="menuitem"
                                >
                                    {option}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const applyFilters = (data) => {
        let filtered = [...data]; // Clone the data array to avoid direct modifications

        // Filter by year if any year is selected
        if (filters.year.selected.length > 0) {
            filtered = filtered.filter(item => filters.year.selected.includes(item.release_year));
        }

        // Filter by genre if any genre is selected and the tab is either 'movies' or 'tv shows'
        if (filters.genres.selected.length > 0 && (selectedTab === 'movies' || selectedTab === 'tv shows')) {
            filtered = filtered.filter(item =>
                Array.isArray(item.genres) && item.genres.some(genre => filters.genres.selected.includes(genre))
            );
        }

        // Sorting logic
        if (filters.sortBy.selected) {
            filtered = filtered.sort((a, b) => {
                if (filters.sortBy.selected === 'rating') {
                    return b.rating - a.rating;
                } else if (filters.sortBy.selected === 'runtime') {
                    return b.runtime - a.runtime;
                }
                return 0;
            });
        }

        return filtered;
    };


    useEffect(() => {
        const newFilteredData = {
            movies: applyFilters(dummyMovies),
            tvShows: applyFilters(dummyTVs),
            users: [], // Apply similar filtering logic if required
            lists: applyFilters(dummyLists)
        };
        setFilteredData(newFilteredData);
    }, [filters]);

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
                <div className="search-bar">
                    {/* Existing elements */}
                    {showFilters && (
                        <div className="flex space-x-4">
                            <FilterDropdown
                                label="year"
                                options={filters.year.options}
                                selected={filters.year.selected}
                                onFilterChange={handleFilterChange}
                            />
                            <FilterDropdown
                                label="sortBy"
                                options={filters.sortBy.options}
                                selected={filters.sortBy.selected}
                                onFilterChange={handleFilterChange}
                            />
                            <FilterDropdown
                                label="genres"
                                options={filters.genres.options}
                                selected={filters.genres.selected}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                    )}
                    {/* Filter Tags and Clear All Button */}
                    {showFilters && (
                        <div className="filter-tags">
                            {/* Filter through each filter category, check if there's a selected value, and render the tags accordingly */}
                            {Object.entries(filters).filter(([_, value]) => {
                                return Array.isArray(value.selected) ? value.selected.length > 0 : value.selected
                            }).map(([key, value]) => (
                                <div key={key} className="inline-block bg-gray-500 rounded-full px-2.5 py-1.5 m-1 mt-3 text-sm">
                                    {`${key}: ${Array.isArray(value.selected) ? value.selected.join(', ') : value.selected}`}
                                    <button type="button" onClick={() => handleRemoveFilter(key)} className="bg-transparent border-none cursor-pointer text-gray-800 ml-2.5">
                                        ×
                                    </button>
                                </div>
                            ))}


                            {/* Show the "Clear All Filters" button only if any filter is actively selected */}
                            {Object.entries(filters).some(([_, value]) => Array.isArray(value.selected) ? value.selected.length > 0 : value.selected) && (
                                <button className="inline-block bg-gray-500 rounded-full px-2.5 py-1.5 m-1 text-sm" onClick={handleClearFilters}>
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}

                </div>
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
