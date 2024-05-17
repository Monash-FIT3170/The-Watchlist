import React from 'react';
import { MdMovieFilter } from 'react-icons/md';
import { MdAdd } from 'react-icons/md';

const Modal = ({ show, onClose, lists }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-2xl w-full h-3/4 relative"> 
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-xl">×</button>
        <div className="mb-4 h-full">
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 h-full overflow-hidden">
            <nav>
              <h2 className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-gray-300 text-lg">
                <MdMovieFilter size={"24px"} /><span>Your Watchlists</span>
              </h2>
              <ul className="h-full overflow-y-hidden hover:overflow-y-scroll hover:scrollbar-webkit scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {lists.map((list) => (
                  <li key={list.listId} className="flex items-center justify-between p-2 bg-gray-700 rounded-lg mb-2">
                    <div className="flex items-center">
                      <img
                        src={list.content[0]?.image_url || './path_to_default_image.jpg'}
                        alt={list.title}
                        className="w-10 h-10 mr-2.5 rounded-lg"
                      />
                      <span className="text-white">{list.title}</span>
                    </div>
                    <button className="text-white bg-purple-500 hover:bg-purple-700 rounded-full p-2">
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
