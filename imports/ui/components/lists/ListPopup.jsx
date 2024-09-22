// imports/ui/ListPopup.jsx
import React, { useEffect, useRef, useState } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import RatingStar from "../ratings/RatingStar";
import { FiEdit, FiTrash2, FiGrid, FiList, FiLink } from "react-icons/fi";
import RenameListModal from "../../modals/RenameListModal";
import { Meteor } from 'meteor/meteor';
import Scrollbar from '../scrollbar/ScrollBar';
import { FaUser, FaGlobe } from "react-icons/fa";
import { RatingCollection } from "../../../db/Rating";
import ContentItem from "../contentItems/ContentItem";
import ContentInfoModal from "../../modals/ContentInfoModal";  // Import the modal component
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton, EmailIcon, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";

const ListPopup = ({ listId, onClose, onRenameList }) => {
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
    const contentInfoModalRef = useRef(null); // Ref for ContentInfoModal
    const modalRef = useRef(null) // Ref for Modal
    const [isModalOpen, setModalOpen] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [imageStyles, setImageStyles] = useState({});
    const [expandedItem, setExpandedItem] = useState(null);
    const [listToDelete, setListToDelete] = useState(null);
    const confirmDialogRef = useRef(null);
    const renameListRef = useRef(null); // Ref for RenameListModal
    const [contentToDelete, setContentToDelete] = useState(null);
    const [shareUrl, setShareUrl] = useState();
    const shareQuote = "Check out this watchlist!";
    const iconSize = 44;

    useEffect(() => {
        if (listId) {
            Meteor.call('list.getById', listId, (err, result) => {
                setLoading(false);
                if (err) {
                    console.error('Error fetching list:', err);
                    setList(null);
                } else {
                    setList(result);
                    // const localhost = "localhost:3000";
                    // const domain = "thewatchlist.xyz" 
                    // Change between domain and localhost when testing
                    // setShareUrl(`https://${localhost}/watchlist/${result._id}`);
                    setShareUrl(`${Meteor.absoluteUrl.defaultOptions.rootUrl}watchlist/${result._id}`);
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

    const isCurrentUserList = list && list.userId === Meteor.userId();

    useEffect(() => {
        if (list?.subscribers && Array.isArray(list.subscribers)) {
            const isSubscribed = list.subscribers.includes(Meteor.userId());
            setIsSubscribed(isSubscribed);
        }
    }, [list?.subscribers]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isModalOpen]); // Run useEffect whenever `isModalOpen` changes

    const handleClickOutside = (event) => {
        if (
            popupRef.current && !popupRef.current.contains(event.target) &&
            (!contentInfoModalRef.current || !contentInfoModalRef.current.contains(event.target)) &&
            (!isModalOpen || !modalRef.current || !modalRef.current.contains(event.target)) &&
            (!renameListRef.current || !renameListRef.current.contains(event.target)) &&
            (!confirmDialogRef.current)
        ) {
            onClose();
            event.stopPropagation();
        } else {
        }
    };

    useEffect(() => {
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
        return [...content].sort((a, b) => {
            let aYear, bYear;

            if (sortCriterion === 'release_year') {
                aYear = a.contentType === 'Movie'
                    ? a.release_year
                    : (a.first_aired ? new Date(a.first_aired).getFullYear() : 0);
                bYear = b.contentType === 'Movie'
                    ? b.release_year
                    : (b.first_aired ? new Date(b.first_aired).getFullYear() : 0);

                if (sortOrder === 'ascending') {
                    return aYear - bYear;
                } else {
                    return bYear - aYear;
                }
            } else if (sortCriterion === 'title') {
                return sortOrder === 'ascending'
                    ? a.title.localeCompare(b.title)
                    : b.title.localeCompare(a.title);
            } else if (sortCriterion === 'popularity') {
                return sortOrder === 'ascending'
                    ? a.popularity - b.popularity
                    : b.popularity - a.popularity;
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
        setModalOpen(true); // Open ContentInfoModal
    };

    const goToSearch = () => {
        setModalOpen(false);
        onClose();
        navigate("/search");
    }

    // Separate close handlers for each modal
    const closeContentInfoModal = () => {
        setModalOpen(false);
        setSelectedContent(null);
    };

    const handleRenameListClick = () => {
        if (list.title === 'Favourite' || list.title === 'To Watch') {
            toast.error('Cannot rename Favourite or To Watch lists');
            return;
        }
        setIsRenameModalOpen(true);
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

    const handleImageLoad = (event, id) => {
        const { naturalWidth, naturalHeight } = event.target;
        if (naturalHeight > naturalWidth) {
            setImageStyles(prev => ({ ...prev, [id]: { height: '50vh', width: '100%' } }));
        } else {
            setImageStyles(prev => ({ ...prev, [id]: { width: '100%', height: 'auto' } }));
        }
    };

    const confirmRemoveContent = (contentId) => {
        setContentToDelete(contentId);
        setListToDelete(null);
        setShowConfirmDialog(true);
    };

    const handleRemoveContentClick = (contentId) => {
        if (contentId !== null) {
            Meteor.call('list.removeContent', { listId: list._id, contentId }, (error) => {
                if (error) {
                    console.error("Error removing content:", error);
                    toast.error("You cannot remove content from another user's list!");
                } else {
                    console.log("Content removed successfully");
                    toast.success("Content removed successfully!");
                    const updatedContent = list.content.filter(item => item.contentId !== contentId);
                    setList({ ...list, content: updatedContent });
                }
            });
        }
    };

    const confirmDeleteList = (listId) => {
        if (list.userId !== Meteor.userId()) {
            toast.error("You cannot delete another user's list!");
            return;
        }

        if (list.title === 'Favourite' || list.title === 'To Watch') {
            toast.error('This list cannot be deleted.');
            return;
        }

        setListToDelete(listId);
        setShowConfirmDialog(true);
    };



    const resetConfirmationState = () => {
        setShowConfirmDialog(false);
        setContentToDelete(null);
        setListToDelete(null);
    };

    const handleDeleteConfirmed = () => {
        if (contentToDelete !== null) {
            handleRemoveContentClick(contentToDelete);
        } else if (listToDelete !== null) {
            Meteor.call('list.delete', { listId: listToDelete }, (error) => {
                if (error) {
                    console.error("Error deleting list:", error);
                } else {
                    onClose();
                }
            });
        }
        resetConfirmationState();
    };

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            console.log('Copied to clipboard: ', text);
            toast.success('Link copied to clipboard');
        } catch (error) {
            console.error('Unable to copy to clipboard:', error);
        }
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
                ref={popupRef}  // Ref for the ListPopup
                className="list-popup bg-darker p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-3/4 overflow-y-auto relative"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold truncate max-w-full" title={list.title}>
                        {list.title.length > 30 ? `${list.title.slice(0, 30)}...` : list.title}
                    </h2>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleCopy(shareUrl)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-full flex items-center justify-center"
                            title="Copy Link"
                            style={{ width: iconSize, height: iconSize }} // Ensuring the button has a fixed size
                        >
                            <FiLink size="24" />
                        </button>
                        <button title="Share to Facebook">
                            <FacebookShareButton url={shareUrl} quote={shareQuote}>
                                <FacebookIcon size={iconSize} round />
                            </FacebookShareButton>
                        </button>
                        <button title="Share to Twitter">
                            <TwitterShareButton url={shareUrl} title={shareQuote}>
                                <TwitterIcon size={iconSize} round />
                            </TwitterShareButton>
                        </button>
                        <button title="Share to Whatsapp">
                            <WhatsappShareButton url={shareUrl} title={shareQuote}>
                                <WhatsappIcon size={iconSize} round />
                            </WhatsappShareButton>
                        </button>
                        <button title="Send in Email">
                            <EmailShareButton url={shareUrl} subject={list.title} body={shareQuote}>
                                <EmailIcon size={iconSize} round />
                            </EmailShareButton>
                        </button>

                        <button
                            onClick={isCurrentUserList ? handleRenameListClick : null}
                            disabled={!isCurrentUserList}
                            className={`font-bold rounded-full flex items-center justify-center ${isCurrentUserList ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                            title="Rename List"
                            style={{ width: iconSize, height: iconSize }} // Ensuring the button has a fixed size
                        >
                            <FiEdit size="24" />
                        </button>
                        <button
                            onClick={() => isCurrentUserList && confirmDeleteList(list._id)}
                            disabled={!isCurrentUserList}
                            className={`font-bold rounded-full flex items-center justify-center ${isCurrentUserList ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                            title="Delete List"
                            style={{ width: iconSize, height: iconSize }} // Ensuring the button has a fixed size
                        >
                            <FiTrash2 size="24" />
                        </button>
                        <button
                            onClick={() => setIsGridView(!isGridView)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-full flex items-center justify-center"
                            title={isGridView ? "Switch to List View" : "Switch to Grid View"}
                            style={{ width: iconSize, height: iconSize }}
                        >
                            {isGridView ? <FiList size="24" /> : <FiGrid size="24" />}
                        </button>
                        {/* Conditionally render subscribe/unsubscribe button */}
                        {list.userId !== Meteor.userId() && (
                            <button
                                onClick={() => isSubscribed ? handleUnsubscribe(list._id) : handleSubscribe(list._id)}
                                className={`px-4 py-2 rounded-full font-bold ${isSubscribed ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'} text-white`}
                            >
                                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                            </button>
                        )}
                        <button
                            className="text-2xl font-bold text-gray-500 hover:text-gray-800"
                            onClick={onClose}
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-wrap">
                        {['all', 'movies', 'tv shows'].map((tab) => (
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
                    <div className="flex-shrink-0">
                        <div className="flex space-x-2">
                            <select
                                value={sortCriterion}
                                onChange={(e) => changeSortCriterion(e.target.value)}
                                className="inline-block px-3 py-1.5 mt-1.5 mb-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out bg-[#282525] text-white border-transparent border appearance-none pr-8 w-auto" // Changed pr-8 and added w-auto
                                style={{
                                    backgroundImage: `url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"%3E%3Cpath fill="white" d="M7 7l3-3 3 3m-6 4l3 3 3-3" /%3E%3C/svg%3E')`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem center',
                                    backgroundSize: '1rem 1rem',
                                }}
                            >
                                <option value="title">Sort by Title</option>
                                <option value="release_year">Sort by Release Year</option>
                                <option value="popularity">Sort by Popularity</option>
                            </select>

                            <button
                                onClick={toggleSortOrder}
                                className={`flex items-center justify-center px-3 py-1.5 mt-1.5 mb-3 rounded-full cursor-pointer transition-all duration-300 ease-in-out 
            ${sortOrder === 'ascending' ? 'bg-[#7B1450] text-white' : 'bg-[#7B1450] text-white'} 
            border-transparent border`}
                            >
                                {sortOrder === 'ascending' ? <FaSortAmountUp className="mr-1" /> : <FaSortAmountDown className="mr-1" />}
                                Sort Order
                            </button>
                        </div>
                    </div>

                </div>
                <Scrollbar className={`max-h-[calc(100vh-10rem)] overflow-y-auto ${isGridView ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-8'}`}>
                    {sortedContent.length === 0 ? (<div className="flex flex-col items-center justify-center py-8">
                        <p className="text-lg font-semibold text-gray-600 mb-4">
                            Your list is currently empty.
                        </p>
                        <p className="text-md text-gray-500 mb-6">
                            Start adding some great movies and shows to enjoy later!
                        </p>
                        <button
                            className="px-6 py-2 bg-magenta text-white rounded hover:bg-pink-700 transition-colors"
                            onClick={() => goToSearch()}
                        >
                            Browse Movies and Shows
                        </button>
                    </div>
                    ) : (sortedContent.map((item) => {
                        const { rating = 0, isUserSpecificRating = false } = getRatingForContent(item.contentId);
                        return (
                            <div key={item.contentId} className={isGridView ? '' : 'block relative'}>
                                {isGridView ? (
                                    <ContentItem
                                        content={item}
                                        isUserSpecificRating={isUserSpecificRating}
                                        popularity={item.popularity}
                                        onClick={() => handleContentClick(item)}  // Open modal on click
                                        contentType={item.contentType}
                                    />
                                ) : (
                                    <div className="overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101" onClick={(e) => handleContentClick(item, e)}>
                                        <div className="relative">
                                            <img
                                                src={item.background_url}
                                                alt={item.title}
                                                className="cursor-pointer w-full h-48 object-cover rounded-t-lg"
                                                style={imageStyles[item.contentId] || {}}
                                                onLoad={(e) => handleImageLoad(e, item.contentId)}
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                                                <div className="absolute bottom-4 left-4 text-white">
                                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                                    <div className="flex items-center">
                                                        {isUserSpecificRating ? (
                                                            <FaUser className="mr-1 text-blue-500" title="User rating" />
                                                        ) : (
                                                            <FaGlobe className="mr-1 text-green-500" title="Global average rating" />
                                                        )}
                                                        <RatingStar totalStars={5} rating={rating} />
                                                    </div>
                                                </div>
                                                <button
                                                    className={`absolute top-4 right-4 rounded-full p-2 ${isCurrentUserList ? 'text-white bg-red-500 hover:bg-red-700' : 'text-gray-500 bg-gray-300 cursor-not-allowed'}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (isCurrentUserList) {
                                                            confirmRemoveContent(item.contentId);
                                                        }
                                                    }}
                                                    title="Remove from List"
                                                    disabled={!isCurrentUserList}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    }))}
                </Scrollbar>
            </div>

            {isRenameModalOpen && (
                <RenameListModal
                    isOpen={isRenameModalOpen}
                    onClose={() => setIsRenameModalOpen(false)}
                    onRename={(newName) => {
                        onRenameList(newName);
                        list.title = newName; // Update the list title locally
                    }}
                    currentName={list.title}
                    ref={renameListRef}
                />
            )}

            {isModalOpen && selectedContent && (
                <ContentInfoModal
                    ref={contentInfoModalRef}  // Ref for the ContentInfoModal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    content={selectedContent}
                    modalRef={modalRef}
                />
            )}

            {showConfirmDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50" ref={confirmDialogRef}>
                    <div
                        className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-gray-300">
                            Are you sure you want to {contentToDelete !== null ? 'remove this content' : 'delete this list'}?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    resetConfirmationState();
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                onClick={(e) => {
                                    e.stopPropagation();  // Stop propagation when confirming deletion
                                    handleDeleteConfirmed();
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default ListPopup;