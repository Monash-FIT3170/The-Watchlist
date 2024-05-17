import React, { useEffect, useRef, useState } from "react";
import RatingStar from "./RatingStar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import RenameListModal from "./RenameListModal";
import { Meteor } from 'meteor/meteor';

interface ContentItemData {
  image_url: string;
  title: string;
  rating: number;
  content_id: number;
  type: string;
  overview: string;
}

interface ContentListProps {
  list: {
    _id: string;
    title: string;
    content: ContentItemData[];
  };
  onClose: () => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
}

const ListPopup: React.FC<ContentListProps> = ({
  list,
  onClose,
  onDeleteList,
  onRenameList,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [contentDetails, setContentDetails] = useState<{ [key: number]: any }>({});
  const [loadingDetails, setLoadingDetails] = useState<{ [key: number]: boolean }>({});
  const [errorDetails, setErrorDetails] = useState<{ [key: number]: boolean }>({});


  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (
      popupRef.current &&
      !popupRef.current.contains(target) &&
      !target.closest(".rename-modal")
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
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [list]);

  const handleExpandClick = (id: number, title: string) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
      if (!contentDetails[id]) {
        fetchContentDetails(title,id);
      }
    }
  };

  const fetchContentDetails = (title: string, contentId: number) => {
    setLoadingDetails(prev => ({ ...prev, [contentId]: true }));
    setErrorDetails(prev => ({ ...prev, [contentId]: false }));

    console.log(`Fetching details for title: ${title}`);
    Meteor.call("content.read", { searchString: title }, (error, result) => {
      setLoadingDetails(prev => ({ ...prev, [contentId]: false }));
      if (error) {
        console.error("Error fetching content details:", error);
        setErrorDetails(prev => ({ ...prev, [contentId]: true }));
      } else {
        console.log("Fetch result:", result);
        const content = result.movie.concat(result.tv).find(item => item.title === title);
        console.log("Content found:", content);
        setContentDetails(prevDetails => ({ ...prevDetails, [contentId]: content || null }));
      }
    });
  };

  const handleDeleteList = (listId: string) => {
    onDeleteList(listId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-darker p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-3/4 overflow-y-auto relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{list.title}</h2>
          <div className="flex space-x-2">
            <button
              onClick={handleRenameListClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-full"
              title="Rename List"
            >
              <FiEdit className="text-lg" />
            </button>
            <button
              onClick={() => handleDeleteList(list._id)}
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
        <div
          ref={scrollContainerRef}
          className="space-y-8 overflow-y-auto max-h-[calc(100vh-5rem)]"
        >
          {list.content.map((item) => (
            <div key={item.content_id} className="block relative">
              <div className="overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-101">
                <div className="relative">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-[35vh] object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                    <div className={"absolute bottom-4 left-4 text-white"}>
                      <h3 className="text-xl font-bold ml-1">{item.title}</h3>
                      <RatingStar totalStars={5} rating={3.5} />
                    </div>
                    <button
                      className="absolute bottom-4 right-4 text-white text-2xl"
                      onClick={() => handleExpandClick(item.content_id, item.title)}
                    >
                      {expandedItem === item.content_id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
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
        </div>
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
    </div>
  );
};

export default ListPopup;
