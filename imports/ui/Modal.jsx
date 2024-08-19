import React, { useEffect, useRef, forwardRef } from 'react';
import { MdMovieFilter, MdAdd } from 'react-icons/md';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Scrollbar from './ScrollBar';

const Modal = forwardRef(({ show, onClose, content, type }, ref) => {
  const modalRef = ref || useRef();

  // Fetch the lists for the current user
  const { lists, loading } = useTracker(() => {
    const userId = Meteor.userId();
    const listsHandle = Meteor.subscribe('userLists', userId);
    const lists = ListCollection.find({ userId }).fetch();
    return { lists, loading: !listsHandle.ready() };
  });

  const popcornUrl = "./ExampleResources/popcorn.png";

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the modal
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!show || loading) return null;

  const handleAddContentClick = (listId, event) => {
    event.stopPropagation(); // Prevents the event from bubbling up and closing the modal

    const list = lists.find(list => list._id === listId);

    if (list && list.content.some(item => item.contentId === content.contentId)) {
      toast.warn("This item is already in the list.");
    } else {
      Meteor.call('list.addContent', { listId, userId: Meteor.userId(), content }, (error) => {
        if (error) {
          toast.error("Failed to add item to the list.");
        } else {
          toast.success("Item successfully added to the list.");
          console.log("Item successfully added")
          console.log(content)
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-1050">
      <ToastContainer style={{ zIndex: 1001 }} />
      <div ref={modalRef} className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-2xl w-full h-3/4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
        <div className="mb-4 h-full">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-full overflow-hidden">
            <nav>
              <h2 className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-gray-300 text-lg">
                <MdMovieFilter size={"24px"} /><span>Your Watchlists</span>
              </h2>
              <Scrollbar className="h-full overflow-y-auto scrollbar-webkit scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                <ul>
                  {lists.map((list) => (
                    <li key={list._id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg mb-2">
                      <div className="flex items-center">
                        <img
                          src={list.content[0]?.image_url || popcornUrl}
                          alt={list.title}
                          className="w-10 h-10 mr-2.5 rounded-lg"
                        />
                        <span className="text-white">{list.title}</span>
                      </div>
                      <button
                        className="text-white bg-purple-500 hover:bg-purple-700 rounded-full p-2"
                        onClick={(event) => handleAddContentClick(list._id, event)}
                      >
                        <MdAdd size={"20px"} />
                      </button>
                    </li>
                  ))}
                </ul>
              </Scrollbar>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Modal;
