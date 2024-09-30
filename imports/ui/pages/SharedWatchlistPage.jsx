import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SharedWatchlistHeader from '../components/headers/SharedWatchlistHeader';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ContentItem from '../components/contentItems/ContentItem';
import Loading from './Loading';
import { AiOutlineSearch } from 'react-icons/ai';  // Import search icon

const SharedWatchlistPage = ({ currentUser }) => {
    const { listId } = useParams();
    const [list, setList] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState(''); // Add searchTerm state
    const navigate = useNavigate();

    const tabMapping = {
        All: 'All',
        Movies: 'Movie',
        'TV Shows': 'TV Show',
    };

    // Fetch the list content
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

    // Filter content based on selected tab and search term
    useEffect(() => {
        if (!loading && list) {
            const filtered = list.content.filter(content => {
                const matchesTab = (selectedTab === 'All' || content.contentType === tabMapping[selectedTab]);
                const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase());
                return matchesTab && matchesSearch; // Filter by both tab and search term
            });

            setFilteredContent(filtered);
        }
    }, [selectedTab, searchTerm, list]);

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <SharedWatchlistHeader list={list} tabMapping={tabMapping} selectedTab={selectedTab} setSelectedTab={setSelectedTab} currentUser={currentUser} />

            {/* Styled Search Bar */}
            <form className="w-full px-6 mb-4">
                <div className="relative">
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
                </div>
            </form>

            <Scrollbar className="search-results-container flex-grow overflow-auto px-6">
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,_200px)] justify-between items-center">
                    {filteredContent.length > 0 ? filteredContent.map((content, index) => (
                        <ContentItem
                            key={index}
                            content={content}
                            isUserSpecificRating={false}
                            contentType={content.contentType}
                        />
                    )) : <p className="text-center text-gray-500 mt-2">No content available.</p>}
                </div>
            </Scrollbar>
        </div>
    );
};

export default SharedWatchlistPage;
