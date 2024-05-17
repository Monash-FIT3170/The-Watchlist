import React, { useEffect, useRef, useState } from "react";
import RatingStar from "./RatingStar";
import { FaChevronDown, FaChevronUp, FaEllipsisV } from "react-icons/fa";
import RenameListModal from "./RenameListModal";

interface ContentItemData {
  image_url: string;
  title: string;
  rating: number;
  id: number;
  type: string;
  overview: string;
}

interface ContentListProps {
  list: {
    listId: string;
    title: string;
    content: ContentItemData[];
  };
  onClose: () => void;
  onDeleteList: (listId: string) => void;
  onRenameList: (listId: string, newName: string) => void;
}

/*
React component which displays a popup list of items which has been passed to it,
is generated from the navbar when it is clicked.
*/

const ListPopup: React.FC<ContentListProps> = ({
  list,
  onClose,
  onDeleteList,
  onRenameList,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  //close the popup when clicking outside of it
  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      if (!isRenameModalOpen) {
        // Add this condition
        onClose();
      }
    }
  };

  const handleRenameListClick = () => {
    setIsRenameModalOpen(true); // Open RenameListModal when the button is clicked
  };

  //listen for the mouse being clicked outside the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //ensure we are going to scroll on the popup rather than the items below it.
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [list]);

  //handle an expansion of an item
  const handleExpandClick = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
    //header of the popup list
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div
        ref={popupRef}
        className="bg-black p-6 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 max-h-3/4 overflow-y-auto relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{list.title}</h2>
          <div className="flex space-x-2">
            {" "}
            {/* Wrap the buttons in a div */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-2xl font-bold text-gray-500 hover:text-gray-800"
            >
              <FaEllipsisV /> {/* Use FaEllipsisV for the "..." button */}
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content bg-black text-white p-2">
                <button onClick={handleRenameListClick}>Rename List</button>
                <button onClick={() => onDeleteList(list.listId)}>
                  Delete List
                </button>
              </div>
            )}
            <button
              className="text-2xl font-bold text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>

        {/*content of the popup list*/}
        <div
          ref={scrollContainerRef}
          className="space-y-8 overflow-y-auto max-h-[calc(100vh-5rem)]"
        >
          {list.content.map((item) => (
            <div key={item.id} className="block relative">
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
                      <RatingStar totalStars={5} rating={item.rating} />
                    </div>
                    <button
                      className="absolute bottom-4 right-4 text-white text-2xl"
                      onClick={() => handleExpandClick(item.id)}
                    >
                      {expandedItem === item.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {expandedItem === item.id && (
                <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                  <p>
                    <strong>Synopsis:</strong> {item.overview}
                  </p>
                  <p>
                    <strong>Director:</strong> Director McDirector
                  </p>
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
            onRename={onRenameList}
            currentName={list.title} // Pass the current list title
          />
        )}
      </div>
    </div>
  );
};

export default ListPopup;
