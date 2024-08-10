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


const ListPopup = ({ listId, onClose, onDeleteList, onRenameList }) => {
  const popupRef = useRef(null); // Ref for ListPopup
  const contentInfoModalRef = useRef(null); // Ref for ContentInfoModal
  const modalRef = useRef(null) // Ref for Modal
  const [expandedItem, setExpandedItem] = useState(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [contentDetails, setContentDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [errorDetails, setErrorDetails] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all'); // Track selected tab
  const [imageStyles, setImageStyles] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [globalRatings, setGlobalRatings] = useState({});
  const [isGridView, setIsGridView] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const confirmDialogRef = useRef(null);

  const { list, loading, ratings } = useTracker(() => {
    const listHandle = Meteor.subscribe('userLists', listId);
    const subscribedListHandle = Meteor.subscribe('subscribedLists', Meteor.userId());
    const ratingsHandle = Meteor.subscribe('userRatings', Meteor.userId());

    const list = ListCollection.findOne({ _id: listId }) || {};
    const ratings = RatingCollection.find({ userId: Meteor.userId() }).fetch(); // Fetch logged-in user's ratings
    const loading = !listHandle.ready() || !subscribedListHandle.ready() || !ratingsHandle.ready();

    return { list, loading, ratings };
  }, [listId]);

  const isListOwner = list.userId === Meteor.userId();

  useEffect(() => {
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (error) {
        console.error("Error fetching global ratings:", error);
      } else {
        setGlobalRatings(result);
      }
    });
  }, []);

  useEffect(() => {
    if (list.subscribers && Array.isArray(list.subscribers)) {
      const isSubscribed = list.subscribers.includes(Meteor.userId());
      setIsSubscribed(isSubscribed);
    }
  }, [list.subscribers]);

  // Separate close handlers for each modal
  const closeContentInfoModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
  };

  const handleContentClick = (item, event) => {
    event.stopPropagation(); // Prevents the event from bubbling up
    const userRating = ratings.find(r => r.contentId === item.contentId);
    const contentWithRating = { ...item, rating: userRating?.rating || 0 };
    setSelectedContent(contentWithRating); // Set the content with rating to be shown in ContentInfoModal
    setModalOpen(true); // Open ContentInfoModal
  };


  const handleSubscribe = (listId) => {
    if (list.userId === Meteor.userId()) {
      console.log('Cannot subscribe to your own list');
      return;
    }
    Meteor.call('list.subscribe', listId, (error) => {
      if (error) {
        console.error('Subscription error:', error);
      } else {
        setIsSubscribed(true);
      }
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
  };

  const handleUnsubscribe = (listId) => {
    Meteor.call('list.unsubscribe', listId, (error) => {
      if (error) {
        console.error('Unsubscription error:', error);
      } else {
        setIsSubscribed(false);
      }
    });
  }

  // Define the handleClickOutside function inside the component
  const handleClickOutside = (event) => {
    console.log("Click detected. Target:", event.target);
    console.log("popupRef current:", popupRef.current);
    console.log("contentInfoModalRef current:", contentInfoModalRef.current);
    console.log("ModalRef current:", modalRef.current);

    // Avoid accessing `modalRef.current` if it's null
    if (modalRef.current) {
      console.log("is modal open:", isModalOpen);
      console.log("modalRef.current:", modalRef.current);
      console.log("modalRef.current.contains(event.target)", modalRef.current.contains(event.target));
    }

    if (
      popupRef.current && !popupRef.current.contains(event.target) &&
      (!contentInfoModalRef.current || !contentInfoModalRef.current.contains(event.target)) &&
      (!isModalOpen || !modalRef.current || !modalRef.current.contains(event.target))
    ) {
      console.log("Click outside all modals detected, closing ListPopup.");
      onClose();
      event.stopPropagation();
    } else {
      console.log("Click inside a modal, should not close.");
    }
  };
  

  const handleRenameListClick = () => {
    if (list.title === 'Favourite' || list.title === 'To Watch') {
      alert('Cannot rename Favourite or To Watch lists');
      return;
    }
    setIsRenameModalOpen(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]); // Run useEffect whenever `isModalOpen` changes
  
  const handleExpandClick = (id, title) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
      if (!contentDetails[id]) {
        fetchContentDetails(title, id);
      }
    }
  };

  const fetchContentDetails = (title, contentId) => {
    setLoadingDetails(prev => ({ ...prev, [contentId]: true }));
    setErrorDetails(prev => ({ ...prev, [contentId]: false }));

    Meteor.call("content.read", { searchString: title }, (error, result) => {
      setLoadingDetails(prev => ({ ...prev, [contentId]: false }));
      if (error) {
        setErrorDetails(prev => ({ ...prev, [contentId]: true }));
      } else {
        const movie = result.movie.find(item => item.title.toLowerCase() === title.toLowerCase());
        const tv = result.tv.find(item => item.title.toLowerCase() === title.toLowerCase());
        const content = movie || tv;
        setContentDetails(prevDetails => ({ ...prevDetails, [contentId]: content || null }));
      }
    });
  };

  const handleRemoveContentClick = (contentId) => {
    if (contentId !== null) {
      Meteor.call('list.removeContent', { listId: list._id, contentId }, (error) => {
        if (error) {
          console.error("Error removing content:", error);
        } else {
          console.log("Content removed successfully");
        }
      });
    }
  };

  const confirmRemoveContent = (contentId) => {
    setContentToDelete(contentId);
    setListToDelete(null);
    setShowConfirmDialog(true);
  };

  const confirmDeleteList = (listId) => {
    if (list.title === 'Favourite' || list.title === 'To Watch') {
      alert('This list cannot be deleted.');
      return;
    }
    setListToDelete(listId);
    setShowConfirmDialog(true);
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

  const resetConfirmationState = () => {
    setShowConfirmDialog(false);
    setContentToDelete(null);
    setListToDelete(null);
  };

  const handleImageLoad = (event, id) => {
    const { naturalWidth, naturalHeight } = event.target;
    if (naturalHeight > naturalWidth) {
      setImageStyles(prev => ({ ...prev, [id]: { height: '50vh', width: '100%' } }));
    } else {
      setImageStyles(prev => ({ ...prev, [id]: { width: '100%', height: 'auto' } }));
    }
  };

  const getRatingForContent = (contentId) => {
    if (isListOwner) {
      const userRating = ratings.find(r => r.contentId === contentId);
      return {
        rating: userRating ? userRating.rating : 0,
        isUserSpecificRating: !!userRating
      };
    } else {
      return {
        rating: globalRatings[contentId]?.average || 0,
        isUserSpecificRating: false
      };
    }
  };

  const filteredContent = list.content?.filter(item =>
    selectedTab === 'all' ||
    (selectedTab === 'movies' && item.type === 'Movie') ||
    (selectedTab === 'tv shows' && item.type === 'TV Show')
  ) || [];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={popupRef}  // Ref for the ListPopup
        className="list-popup bg-darker p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-3/4 overflow-y-auto relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{list.title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleRenameListClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-full flex items-center justify-center"
              title="Rename List"
              style={{ width: 44, height: 44 }} // Ensuring the button has a fixed size
            >
              <FiEdit size="24" />
            </button>
            <button
              onClick={() => confirmDeleteList(list._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold rounded-full flex items-center justify-center"
              title="Delete List"
              style={{ width: 44, height: 44 }} // Ensuring the button has a fixed size
            >
              <FiTrash2 size="24" />
            </button>
            <button
              onClick={() => setIsGridView(!isGridView)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold rounded-full flex items-center justify-center"
              title={isGridView ? "Switch to List View" : "Switch to Grid View"}
              style={{ width: 44, height: 44 }}
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
        <div className="bubbles-container flex justify-start mt-2">
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
        <Scrollbar className={`max-h-[calc(100vh-10rem)] overflow-y-auto ${isGridView ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-8'}`}>
          {filteredContent.map((item) => {
            const { rating = 0, isUserSpecificRating = false } = getRatingForContent(item.contentId);
            return (
              <div key={item.contentId} className={isGridView ? '' : 'block relative'}>
                {isGridView ? (
                  <ContentItem
                    content={item}
                    isUserSpecificRating={isUserSpecificRating}
                    onClick={() => handleContentClick(item)}  // Open modal on click
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
                              <FaUser className="mr-1 text-blue-500" />
                            ) : (
                              <FaGlobe className="mr-1 text-green-500" />
                            )}
                            <RatingStar totalStars={5} rating={rating} />
                          </div>
                        </div>
                        <button
                          className="absolute bottom-4 right-4 text-white text-2xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExpandClick(item.contentId, item.title);
                          }}
                        >
                          {expandedItem === item.contentId ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <button
                          className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-700 rounded-full p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmRemoveContent(item.contentId);
                          }}
                          title="Remove from List"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div
            ref={confirmDialogRef}
            className="bg-gray-800 rounded-lg shadow-lg p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-300">
              Are you sure you want to {contentToDelete !== null ? 'remove this content' : 'delete this list'}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-600 hover:bg-gray-500 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                onClick={resetConfirmationState}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={handleDeleteConfirmed}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPopup;
