import React, { useState, useEffect, useCallback } from 'react';
import { AiOutlineSearch, AiOutlineDown, AiOutlineFilter } from 'react-icons/ai';
import ContentItem from './ContentItem';
import ListDisplay from './ListDisplay';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import Scrollbar from './ScrollBar';  // Import the Scrollbar component
import UserList from './UserList';
import ProfileDropdown from './ProfileDropdown';

const SearchBar = ({ currentUser }) => {

    const [selectedTab, setSelectedTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [globalRatings, setGlobalRatings] = useState({});
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [filteredTVShows, setFilteredTVShows] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [showFilters, setShowFilters] = useState(false); 
    const [filters, setFilters] = useState({
        year: {
            options: [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000, 1999, 1998, 1997, 1996, 1995, 1994, 1993, 1992, 1991, 1990],
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
        "sort by": {
            options: ["rating", "runtime"],
            selected: "" // this is string as opposed to arrays above due to lack of multi-select
        }
    });

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
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {options.map(option => (
                                <a
                                    key={option}
                                    className={`block px-4 py-2 text-sm hover:bg-gray-700 cursor-pointer ${selected.includes(option) ? 'font-bold bg-gray-700' : 'bg-transparent'}`}
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
    

    const toggleFilters = () => setShowFilters(!showFilters);

    const applyFilters = (data) => {
        let filtered = [...data]; // Clone the data array to avoid direct modifications

        // Filter by year if any year is selected
        if (filters.year.selected.length > 0) {
            filtered = filtered.filter(item => filters.year.selected.includes(item.release_year));
        }

        // Filter by genre if any genre is selected and the tab is either 'movies' or 'tv shows'
        if (filters.genres.selected.length > 0 && (selectedTab === 'movies' || selectedTab === 'tv shows')) {
            filtered = filtered.filter(item => {
                console.log("Checking genres for item:", item);
                return Array.isArray(item.genres) && item.genres.some(genre => filters.genres.selected.includes(genre));
            });
        }

        // Sorting logic
        if (filters["sort by"].selected) {
            filtered = filtered.sort((a, b) => {
                if (filters["sort by"].selected === 'rating') {
                    return b.rating - a.rating;
                } else if (filters["sort by"].selected === 'runtime') {
                    return b.runtime - a.runtime;
                }
                return 0;
            });
        }

        return filtered;
    };

    // useEffect(() => {
    //     const newFilteredData = {
    //         movies: applyFilters(movies),
    //         tvShows: applyFilters(tv shows),
    //         users: [], // Apply similar filtering logic if required
    //         lists: applyFilters(Lists) // Use lists from context
    //     };
    //     setFilteredData(newFilteredData);
    // }, [filters, movies, tvs, lists]);

    // const [filteredData, setFilteredData] = useState({
    //     movies: movies,
    //     tvShows: tvs,
    //     users: [], // there will be a similar dummy data array for users
    //     lists: lists  // there will be a similar dummy data array for lists
    // });


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

    const fetchContent = useCallback((id = null, contentType = null) => {
        const options = {
            searchString: searchTerm,
            limit,
            page: currentPage,
            ...filters // Include filters in the options
        };
        if (id) {
            options.id = id;
            options.contentType = contentType; // Pass content type when fetching single item
        }

        Meteor.call('content.read', options, (error, result) => {
            if (!error) {
                if (id) {
                    // Handle single content details
                    console.log("Single content details:", result);
                } else {
                    // Handle paginated results
                    const totalItems = result.total;
                    setTotalPages(Math.ceil(totalItems / limit));
                    setFilteredMovies(result.movie?.map(movie => ({ ...movie, contentType: 'Movie' })) || []);
                    setFilteredTVShows(result.tv?.map(tv => ({ ...tv, contentType: 'TV Show' })) || []);
                }
            } else {
                console.error("Error fetching content:", error);
                setFilteredMovies([]);
                setFilteredTVShows([]);
            }
        });
    }, [searchTerm, currentPage, filters]);

    useEffect(() => {
        fetchContent();
    }, [fetchContent, searchTerm, filters]);

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

    return (
        <div className="relative flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2 h-full">
            <div className="absolute top-4 right-4">
                <ProfileDropdown user={currentUser} />
            </div>
            <form className="flex flex-col items-start w-full pl-1">
                <div className="flex justify-between items-center w-full max-w-6xl">
                    <div className="relative flex-grow ml-20 mr-20">
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
                    {['All','Movies', 'TV Shows', 'Lists', 'Users'].map((tab) => (
                        <div
                            key={tab.toLowerCase()}
                            className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 cursor-pointer transition-all text-xl duration-300 ease-in-out ${selectedTab === tab ? 'underline text-[#7B1450]' : 'text-[#989595] hover:text-[#fbc0e2] hover:underline'}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                    <button
                        type="button"
                        className={`ml-4 transition-all duration-300 ease-in-out ${showFilters ? 'underline text-[#7B1450]' : 'text-[#989595]'} ${!showFilters && 'hover:text-[#fbc0e2] hover:underline'}`}
                        onClick={toggleFilters}
                        style={{ position: 'relative', top: '-1mm' }}
                    >
                        <AiOutlineFilter size={20} />
                    </button>
                    {showFilters && (
                        <div className="flex space-x-4" style={{ display: 'inline-flex', marginLeft: '30px' }}>
                            <div style={{ width: '80px', marginTop: '2mm' }}>
                                <FilterDropdown
                                    label="Year"
                                    options={filters.year.options}
                                    selected={filters.year.selected}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                            <div style={{ width: '90px', marginTop: '2mm' }}>
                                <FilterDropdown
                                    label="Genres"
                                    options={filters.genres.options}
                                    selected={filters.genres.selected}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                            <div style={{ width: '110px' , marginTop: '2mm' }}>
                                <FilterDropdown
                                    label="Sort By"
                                    options={filters["sort by"].options}
                                    selected={filters["sort by"].selected}
                                    onFilterChange={handleFilterChange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </form>
            <Scrollbar className="search-results-container flex-grow overflow-auto">
                {selectedTab === 'Movies' && (
                    <div className="grid-responsive">
                        {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                            <ContentItem content={movie} contentType="Movie" key={movie.contentId} />
                        )) : <div></div>}
                    </div>
                )}
                {selectedTab === 'TV Shows' && (
                    <div className="grid-responsive">
                        {filteredTVShows.length > 0 ? filteredTVShows.map(tv => (
                            <ContentItem content={tv} contentType="TV Show" key={tv.contentId} />
                        )) : <div></div>}
                    </div>
                )}
                {selectedTab === 'Lists' && (
                    filteredLists.length > 0 ? (
                        <ListDisplay listData={filteredLists} />
                    ) : (
                        <div></div>
                    )
                )}
                {selectedTab === 'Users' && (
                    users.length > 0 ? (
                        <UserList users={users} searchTerm={searchTerm} currentUser={currentUser} />
                    ) : (
                        <div></div>
                    )
                )}
                {selectedTab === 'All' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredMovies.length > 0 ? filteredMovies.map(movie => (
                            <ContentItem content={movie} contentType="Movie" key={movie.contentId} />
                        )) : <div></div>}
                    
                        {filteredTVShows.length > 0 ? filteredTVShows.map(tv => (
                            <ContentItem content={tv} contentType="TV Show" key={tv.contentId} />
                        )) : <div></div>}
                    </div>
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
