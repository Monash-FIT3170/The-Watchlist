import React, { useEffect, useRef } from 'react';
import { MdMovieFilter, MdAdd } from 'react-icons/md';
import { useLists } from './ListContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Modal = ({ show, onClose, movie }) => {
  const { lists, handleAddContent } = useLists(); // Use lists and handleAddContent from context
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!show) return null;

  const handleAddContentClick = (listId) => {
    const content = {
      content_id: movie.id,
      title: movie.title,
      image_url: movie.image_url,
      type: 'Movie',
      user_rating: 4 // THIS OBVIOUSLY NEEDS TO BE CHANGED
    };

    const list = lists.find(list => list._id === listId);
    if (list && list.content.some(item => item.content_id === content.content_id)) {
      toast.warn("This item is already in the list.");
    } else {
      handleAddContent(listId, content); // Use context method
      toast.success("Item successfully added to the list.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <ToastContainer />
      <div ref={modalRef} className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-2xl w-full h-3/4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
        <div className="mb-4 h-full">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-full overflow-hidden">
            <nav>
              <h2 className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-gray-300 text-lg">
                <MdMovieFilter size={"24px"} /><span>Your Watchlists</span>
              </h2>
              <ul className="h-full overflow-y-hidden hover:overflow-y-scroll hover:scrollbar-webkit scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {lists.map((list) => (
                  <li key={list._id} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg mb-2">
                    <div className="flex items-center">
                      <img
                        src={list.content[0]?.image_url || './path_to_default_image.jpg'}
                        alt={list.title}
                        className="w-10 h-10 mr-2.5 rounded-lg"
                      />
                      <span className="text-white">{list.title}</span>
                    </div>
                    <button
                      className="text-white bg-purple-500 hover:bg-purple-700 rounded-full p-2"
                      onClick={() => handleAddContentClick(list._id)}
                    >
                      <MdAdd size={"20px"} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
