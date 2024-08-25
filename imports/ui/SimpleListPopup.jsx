// imports/ui/ListPopup.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import RatingStar from "./RatingStar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiEdit, FiTrash2, FiGrid, FiList } from "react-icons/fi";
import RenameListModal from "./RenameListModal";
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { ListCollection } from "../db/List";
import Scrollbar from './ScrollBar';
import { FaUser, FaGlobe } from "react-icons/fa";
import { RatingCollection } from "../db/Rating";
import ContentItem from "./ContentItem";
import ContentInfoModal from "./ContentInfoModal";  // Import the modal component
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const SimpleListPopup = ({ listId, onClose }) => {
    const [list, setList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isGridView, setIsGridView] = useState(false);
    const [sortOrder, setSortOrder] = useState('ascending');
    const [sortCriterion, setSortCriterion] = useState('title'); // State for sorting criterion
    const [globalRatings, setGlobalRatings] = useState({});
    const [selectedContent, setSelectedContent] = useState(null);
    const [selectedTab, setSelectedTab] = useState('all');
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const popupRef = useRef(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        if (listId) {
            console.log('Fetching list with listId:', listId);
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

        Meteor.call('ratings.getGlobalAverages', (error, result) => {
            if (error) {
                console.error("Error fetching global ratings:", error);
            } else {
                setGlobalRatings(result);
            }
        });
    }, [listId]);

    useEffect(() => {
        if (list?.subscribers && Array.isArray(list.subscribers)) {
            const isSubscribed = list.subscribers.includes(Meteor.userId());
            setIsSubscribed(isSubscribed);
        }
    }, [list?.subscribers]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const { ratings } = useTracker(() => {
        const ratingsHandle = Meteor.subscribe('userRatings', Meteor.userId());
        const ratings = RatingCollection.find({ userId: Meteor.userId() }).fetch();

        return { ratings };
    }, []);

    const toggleSortOrder = () => {
        setSortOrder(currentOrder => currentOrder === 'ascending' ? 'descending' : 'ascending');
    };

    const changeSortCriterion = (criterion) => {
        setSortCriterion(criterion);
    };

    const sortContent = (content) => {
        return content.sort((a, b) => {
            if (sortOrder === 'ascending') {
                return sortCriterion === 'title'
                    ? a.title.localeCompare(b.title)
                    : a.release_year - b.release_year;
            } else {
                return sortCriterion === 'title'
                    ? b.title.localeCompare(a.title)
                    : b.release_year - a.release_year;
            }
        });
    };

    const getRatingForContent = (contentId) => {
        const userRating = ratings.find(r => r.contentId === contentId);
        return {
            rating: userRating ? userRating.rating : globalRatings[contentId]?.average || 0,
            isUserSpecificRating: !!userRating
        };
    };

    const handleContentClick = (item) => {
        const { rating, isUserSpecificRating } = getRatingForContent(item.contentId);
        setSelectedContent({ ...item, rating, isUserSpecificRating });
    };

    const closeModal = () => {
        setSelectedContent(null);
    };

    const removeContent = (contentId) => {
        Meteor.call('list.removeContent', { listId, contentId }, (err) => {
            if (err) {
                console.error('Error removing content:', err);
            } else {
                setList((prevList) => ({
                    ...prevList,
                    content: prevList.content.filter(item => item.contentId !== contentId)
                }));
            }
        });
    };

    const openRenameModal = () => {
        setIsRenameModalOpen(true);
    };

    const handleRenameList = (newName) => {
        Meteor.call('list.rename', { listId, newName }, (err) => {
            if (err) {
                console.error('Error renaming list:', err);
            } else {
                setList((prevList) => ({
                    ...prevList,
                    title: newName
                }));
            }
            setIsRenameModalOpen(false);
        });
    };

    const handleSubscribe = () => {
        Meteor.call('list.subscribe', listId, (err) => {
            if (err) {
                console.error('Subscription error:', err);
            } else {
                setIsSubscribed(true);
            }
        });
    };

    const handleUnsubscribe = () => {
        Meteor.call('list.unsubscribe', listId, (err) => {
            if (err) {
                console.error('Unsubscription error:', err);
            } else {
                setIsSubscribed(false);
            }
        });
    };

    const handleRenameListClick = () => {
        if (list.title === 'Favourite' || list.title === 'To Watch') {
            alert('Cannot rename Favourite or To Watch lists');
            return;
        }
        setIsRenameModalOpen(true);
    };

    const filteredContent = list?.content?.filter(item =>
        selectedTab === 'all' ||
        (selectedTab === 'movies' && item.contentType === 'Movie') ||
        (selectedTab === 'tv shows' && item.contentType === 'TV Show')
    ) || [];

    const sortedContent = sortContent(filteredContent);

    if (loading) return <div>Loading...</div>;
    if (!list) return <div>No list found.</div>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div
                ref={popupRef}
                className="list-popup bg-darker p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-3/4 overflow-y-auto relative"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">{list.title}</h2>
                    <div className="flex space-x-2">
                        <button onClick={handleRenameListClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center" title="Rename List" style={{ width: 44, height: 44 }}>
                            <FiEdit size="24" />
                        </button>
                        <button onClick={() => confirmDeleteList(list._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-full flex items-center justify-center" title="Delete List" style={{ width: 44, height: 44 }}>
                            <FiTrash2 size="24" />
                        </button>
                        <button onClick={() => setIsGridView(!isGridView)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-full flex items-center justify-center" title={isGridView ? "Switch to List View" : "Switch to Grid View"} style={{ width: 44, height: 44 }}>
                            {isGridView ? <FiList size="24" /> : <FiGrid size="24" />}
                        </button>
                        {list.userId !== Meteor.userId() && (
                            <button onClick={() => isSubscribed ? handleUnsubscribe(list._id) : handleSubscribe(list._id)} className={`px-4 py-2 rounded-full font-bold ${isSubscribed ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white`}>
                                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        )}
                        <button className="text-2xl font-bold text-gray-500 hover:text-gray-800" onClick={onClose}>
                            &times;
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-wrap">
                        {['all', 'movies', 'tv shows'].map((tab) => (
                            <div key={tab} className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${selectedTab === tab ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`} onClick={() => setSelectedTab(tab)}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex space-x-2">
                            <select value={sortCriterion} onChange={changeSortCriterion} className="inline-block px-3 py-1.5 mt-1.5 mb-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out bg-[#282525] text-white border-transparent border appearance-none pr-8 w-auto" style={{ backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"%3E%3Cpath fill="white" d="M7 7l3-3 3 3m-6 4l3 3 3-3" /%3E%3C/svg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem 1rem' }}>
                                <option value="title">Sort by Title</option>
                                <option value="release_year">Sort by Release Year</option>
                            </select>
                            <button onClick={toggleSortOrder} className={`flex items-center justify-center px-3 py-1.5 mt-1.5 mb-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${sortOrder === 'ascending' ? 'bg-[#7B1450] text-white' : 'bg-[#7B1450] text-white'} border-transparent border`}>
                                {sortOrder === 'ascending' ? <FaSortAmountUp className="mr-1" /> : <FaSortAmountDown className="mr-1" />}
                                Sort Order
                            </button>
                        </div>
                    </div>
                </div>
                <Scrollbar className={`max-h-[calc(100vh-10rem)] overflow-y-auto ${isGridView ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-8'}`}>
                    {sortedContent.map((item) => {
                        const { rating, isUserSpecificRating } = getRatingForContent(item.contentId);

                        return (
                            <div key={item.contentId} className={isGridView ? '' : 'block relative'}>
                                <ContentItem
                                    content={item}
                                    isUserSpecificRating={isUserSpecificRating}
                                    rating={rating}
                                    onClick={() => handleContentClick(item)}  // Handle click to show content info
                                />
                            </div>
                        );
                    })}
                </Scrollbar>

            </div>
            {isRenameModalOpen && (
                <RenameListModal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} onRename={(newName) => { onRenameList(newName); list.title = newName; }} currentName={list.title} ref={renameListRef} />
            )}
            {isModalOpen && selectedContent && (
                <ContentInfoModal ref={contentInfoModalRef} isOpen={isModalOpen} onClose={() => setModalOpen(false)} content={selectedContent} modalRef={modalRef} />
            )}
            {showConfirmDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" ref={confirmDialogRef}>
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                        <p className="text-gray-300">Are you sure you want to {contentToDelete !== null ? 'remove this content' : 'delete this list'}?</p>
                        <div className="flex justify-end space-x-4">
                            <button className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" onClick={(e) => { e.stopPropagation(); resetConfirmationState(); }}>
                                Cancel
                            </button>
                            <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" onClick={(e) => { e.stopPropagation(); handleDeleteConfirmed(); }}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleListPopup;