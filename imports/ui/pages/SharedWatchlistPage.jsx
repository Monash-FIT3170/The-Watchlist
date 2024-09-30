import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SharedWatchlistHeader from '../components/headers/SharedWatchlistHeader';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ContentItem from '../components/contentItems/ContentItem';
import Loading from './Loading';

const SharedWatchlistPage = ({currentUser}) => {
    const { listId } = useParams();
    const [list, setList] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('All');
    const navigate = useNavigate();

    const tabMapping = {
        All: 'All',
        Movies: 'Movie',
        'TV Shows': 'TV Show',
    };

    // Call list.getById to get the content list
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

    // Filter content list based on selected tab
    useEffect(() => {
        if (!loading && list) {
            const filtered = list.content.filter(content => {
                const matchesTab = (selectedTab === 'All' || content.contentType === tabMapping[selectedTab]);
                return matchesTab;
            });

            setFilteredContent(filtered);
        }
    }, [selectedTab, list]);

    if (loading) return <Loading pageName={"List"}/>;

    // if (!currentUser) {
    //     // Redirect to login page if user is not logged in
    //     navigate("/login");
    //     return;
    // }

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <SharedWatchlistHeader list={list} tabMapping={tabMapping} selectedTab={selectedTab} setSelectedTab={setSelectedTab} currentUser={currentUser} />
            <Scrollbar className="search-results-container flex-grow overflow-auto px-4">
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
}

export default SharedWatchlistPage;