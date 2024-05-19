import React, { useEffect, useRef, useState } from "react";
import RatingStar from "./RatingStar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RenameListModal from "./RenameListModal";
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';
import { useLists } from './ListContext';
import { getImageUrl } from "./imageUtils";
import Scrollbar from './ScrollBar'; // Import the Scrollbar component

const ListPopup = ({ list, onClose, onDeleteList, onRenameList }) => {
  const { handleRemoveContent, fetchLists, lists } = useLists();
  const popupRef = useRef(null);
  const confirmDialogRef = useRef(null);
  const [expandedItem, setExpandedItem] = useState(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [contentDetails, setContentDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [errorDetails, setErrorDetails] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [listToDelete, setListToDelete] = useState(null);
  const [updatedList, setUpdatedList] = useState(list); // Track updated list
  const [selectedTab, setSelectedTab] = useState('all'); // Track selected tab
  const [imageStyles, setImageStyles] = useState({});
  const navigate = useNavigate();

  const handleRedirect = (type, id) => {
    onClose();
    navigate(`/${type}${id}`);
  };

  const handleClickOutside = (event) => {
    const target = event.target;
    if (
      popupRef.current &&
      !popupRef.current.contains(target) &&
      !target.closest(".rename-modal") &&
      (!confirmDialogRef.current || !confirmDialogRef.current.contains(target))
    ) {
      onClose();
    }
  };

  const handleRenameListClick = () => {
    setIsRenameModalOpen(true);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Find the updated list in the lists array from context
    const updatedList = lists.find(l => l._id === list._id);
    if (updatedList) {
      setUpdatedList(updatedList);
    }
  }, [lists, list._id]); // Depend on lists and list._id

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
      handleRemoveContent(list._id, contentId, fetchLists);
    }
  };

  const confirmRemoveContent = (contentId) => {
    setContentToDelete(contentId);
    setListToDelete(null);
    setShowConfirmDialog(true);
  };

  const confirmDeleteList = (listId) => {
    setListToDelete(listId);
    setContentToDelete(null);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirmed = () => {
    if (contentToDelete !== null) {
      handleRemoveContentClick(contentToDelete);
    } else if (listToDelete !== null) {
      onDeleteList(listToDelete);
      onClose();
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

  const filteredContent = updatedList.content.filter(item =>
    selectedTab === 'all' ||
    (selectedTab === 'movies' && item.type === 'Movie') ||
    (selectedTab === 'tv shows' && item.type === 'TV Show')
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        ref={popupRef}
        className="bg-darker p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-3/4 overflow-y-auto relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{updatedList.title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleRenameListClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-full"
              title="Rename List"
            >
              <FiEdit className="text-lg" />
            </button>
            <button
              onClick={() => confirmDeleteList(list._id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded-full"
              title="Delete List"
            >
              <FiTrash2 className="text-lg" />
            </button>
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
        <Scrollbar className="space-y-8 max-h-[calc(100vh-10rem)]">
          {filteredContent.map((item) => (
            <div key={item.content_id} className="block relative">
              <div className="overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101">
                <div className="relative">
                  <img
                    src={getImageUrl(item.background_url)}
                    alt={item.title}
                    className="cursor-pointer" // Change to maintain aspect ratio
                    style={imageStyles[item.content_id] || {}}
                    onLoad={(e) => handleImageLoad(e, item.content_id)}
                    onClick={() => {
                      console.log(`Image clicked: ${item.type}, ${item.content_id}`);
                      handleRedirect(item.type, item.content_id);
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60" style={{ pointerEvents: 'none' }}>
                    <div className="absolute bottom-4 left-4 text-white" style={{ pointerEvents: 'auto' }}>
                      <h3 className="text-xl font-bold ml-1">{item.title}</h3>
                      <RatingStar totalStars={5} rating={3.5} />
                    </div>
                    <button
                      className="absolute bottom-4 right-4 text-white text-2xl"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the image
                        handleExpandClick(item.content_id, item.title);
                      }}
                      style={{ pointerEvents: 'auto' }}
                    >
                      {expandedItem === item.content_id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <button
                      className="absolute top-4 right-4 text-white bg-red-500 hover:bg-red-700 rounded-full p-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click from propagating to the image
                        confirmRemoveContent(item.content_id);
                      }}
                      title="Remove from List"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
              {expandedItem === item.content_id && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                  {loadingDetails[item.content_id] ? (
                    <p>Loading...</p>
                  ) : errorDetails[item.content_id] ? (
                    <p>Error loading details.</p>
                  ) : contentDetails[item.content_id] ? (
                    <>
                      <p>
                        <strong>Synopsis:</strong> {contentDetails[item.content_id].overview}
                      </p>
                      <p>
                        <strong>Director:</strong> Example Director
                      </p>
                    </>
                  ) : (
                    <p>No details available.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </Scrollbar>
      </div>
      <div className="z-50">
        {isRenameModalOpen && (
          <RenameListModal
            isOpen={isRenameModalOpen}
            onClose={() => setIsRenameModalOpen(false)}
            onRename={(newName) => {
              onRenameList(list._id, newName);
              list.title = newName; // Update the list title locally
            }}
            currentName={list.title}
          />
        )}
      </div>
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div ref={confirmDialogRef} className="bg-darker p-6 rounded-lg">
            <p className="text-white mb-4">
              Are you sure you want to {contentToDelete !== null ? 'remove this content' : 'delete this list'}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold p-2 rounded"
                onClick={resetConfirmationState}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 rounded"
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
