import React, { useState } from 'react';
import RatingStar from './RatingStar';
import { FaUser } from 'react-icons/fa';
import ContentInfoModal from './ContentInfoModal';  // Import your modal component

const List = ({ list, onContentClick }) => {

  console.log(list)

  return (
    <div key={list._id} className="space-y-8">
      {list.content.map(item => (
        <div key={item.contentId} className="relative" onClick={() => onContentClick(item)}>
          <div className="relative rounded-lg shadow-lg cursor-pointer overflow-visible">
            <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
              <img
                src={item.background_url}
                alt={item.title}
                className="w-full h-35vh object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                <div className="text-white">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm">{item.description}</p>
                  <div className="flex items-center">
                    {item.isUserSpecificRating && <FaUser className="mr-1 text-blue-500" />}
                    <RatingStar totalStars={5} rating={item.rating} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const HomeList = ({ title, lists }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const handleContentClick = (content) => {
    setSelectedContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedContent(null);
  };

  const isEmpty = lists.every(list => list.content.length === 0);

  return (
    <div className="w-full h-full px-5 py-5 rounded-lg flex flex-col items-left shadow-xl overflow-auto scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-thin">
      <h1 className="font-sans font-bold text-4xl my-4 mt-0 mb-4">{title}</h1>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="text-lg text-white mb-4">You don't have any items in this list yet.</p>
          <button 
            className="px-6 py-2 bg-magenta text-white rounded hover:bg-pink-700 transition-colors"
            onClick={() => navigate('/search')}
          >
            Find great movies and shows
          </button>
        </div>
      ) : (
        <div className="w-full overflow-visible">
          {lists.map((list) => (
            <List key={list._id} list={list} onContentClick={handleContentClick} />
          ))}
        </div>
      )}

      {isModalOpen && selectedContent && (
        <ContentInfoModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          content={selectedContent}
        />
      )}
    </div>
  );
};

export default HomeList;
