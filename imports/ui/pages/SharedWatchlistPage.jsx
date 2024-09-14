import { Meteor } from 'meteor/meteor';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SharedWatchlistHeader from '../components/headers/SharedWatchlistHeader';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ContentItem from '../components/contentItems/ContentItem';

const SharedWatchlistPage = ({currentUser}) => {
    const { listId } = useParams();
    const [list, setList] = useState([]);
    const [filteredContent, setFilteredContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('All');


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
        if (!loading) {
            const filtered = list.content.filter(content => {
                const matchesTab = (selectedTab === 'All' || content.contentType === tabMapping[selectedTab]);
                return matchesTab;
            });

            setFilteredContent(filtered);
        }
    }, [selectedTab, list]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <SharedWatchlistHeader username={list.userName} listName={list.title} tabMapping={tabMapping} selectedTab={selectedTab} setSelectedTab={setSelectedTab} currentUser={currentUser} />
            <Scrollbar className="search-results-container flex-grow overflow-auto">
                <div className="grid-responsive">
                    {filteredContent.length > 0 ? filteredContent.map((content, index) => (
                        <ContentItem
                            key={index}
                            content={content}
                            isUserSpecificRating={false}
                            contentType={content.contentType}
                        />
                    )) : <p>No content available.</p>}
                </div>
            </Scrollbar>
        </div>
    );
}

export default SharedWatchlistPage;