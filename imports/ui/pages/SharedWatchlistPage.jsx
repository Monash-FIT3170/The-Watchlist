// imports/ui/pages/SharedWatchlistPage.jsx

// imports/ui/pages/SharedWatchlistPage.jsx

import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SharedWatchlistHeader from '../components/headers/SharedWatchlistHeader';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ContentItem from '../components/contentItems/ContentItem';
import Loading from './Loading';
import { AiOutlineSearch } from 'react-icons/ai';  // Import search icon
import DropdownMenu from '../components/dropdowns/DropdownMenu';
import { FaTimesCircle } from 'react-icons/fa';

const SharedWatchlistPage = ({  currentUser  }) => {
  const { listId } = useParams();
  const [list, setList] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState(''); // Add searchTerm state
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSortOption, setSelectedSortOption] = useState('');
  const navigate = useNavigate();

  const tabMapping = {
    All: 'All',
    Movies: 'Movie',
    'TV Shows': 'TV Show',
  };

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

    const handleGenreSelect = (item) => {
        setSelectedGenre(item.value);
    };

    const handleSortOptionSelect = (item) => {
        setSelectedSortOption(item.value);
    };

    const handleClearFilters = () => {
        setSelectedGenre('');
        setSelectedSortOption('');
        setSearchTerm(''); // Clear search as well
    };

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

    useEffect(() => {
        if (!loading && list) {
            let filtered = list.content.filter((content) => {
                const matchesTab =
                    selectedTab === 'All' || content.contentType === tabMapping[selectedTab];
                const matchesGenre =
                    selectedGenre === '' || (content.genres && content.genres.includes(selectedGenre));
                const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesTab && matchesGenre && matchesSearch;
            });

            if (selectedSortOption) {
                filtered = sortContent(filtered, selectedSortOption);
            }

            setFilteredContent(filtered);
        }
    }, [selectedTab, selectedGenre, selectedSortOption, searchTerm, list, loading]);

    if (loading) return <Loading pageName={"List"} />;

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <SharedWatchlistHeader
                list={list}
                tabMapping={tabMapping}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                currentUser={currentUser}
            />

            {/* Filters, Search, and Sorting */}
            <div className="flex items-center justify-between w-full mt-2 px-6 mb-4"> {/* Added margin-bottom */}
                <form className="relative w-full max-w-lg mr-4">
                    <input
                        type="text"
                        className="rounded-full bg-[#1F1F1F] border border-gray-600 pl-12 pr-4 py-3 w-full text-white placeholder-gray-400 focus:outline-none focus:border-custom-primary transition-all shadow-md"
                        placeholder="Search your watchlist..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4">
                        <AiOutlineSearch className="text-gray-400" size={20} />
                    </span>
                </form>

                <div className="flex items-center justify-end">
                    <div className="mr-4 mb-2">
                        <DropdownMenu
                            defaultText="All Genres"
                            allText="All Genres"
                            items={genreItems}
                            onSelect={handleGenreSelect}
                            selectedValue={selectedGenre}
                        />
                    </div>

                    <div className="mr-4 mb-2">
                        <DropdownMenu
                            defaultText="Sort By"
                            allText="Sort By"
                            items={sortItems}
                            onSelect={handleSortOptionSelect}
                            selectedValue={selectedSortOption}
                        />
                    </div>

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

            {/* Movie List Section */}
            <Scrollbar className="search-results-container flex-grow overflow-auto px-6 mt-4"> {/* Added margin-top */}
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

