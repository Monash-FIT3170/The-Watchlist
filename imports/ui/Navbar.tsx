import React, { useState } from "react";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { MdMovieFilter } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import ListPopup from "./ListPopup";
import NewListModal from "./NewListModal";
import usePopup from './usePopup';
import { useLists } from './ListContext'; // Import the context
import Scrollbar from './ScrollBar'; // Import the Scrollbar component

const popcornUrl = "./ExampleResources/popcorn.png";

export default function Navbar({ staticNavData }) { // Remove listData, onAddList, onDeleteList, onRenameList props
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);

  // Use the context to get lists and list management functions
  const { lists, handleCreateList, handleDeleteList, handleRenameList } = useLists();

  const handleAddList = () => {
    setIsAddListModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <IconContext.Provider value={{ size: "20px" }}>
        <div className="flex flex-col w-64 p-0 mx-2 my-4 h-custom">
          <div className="bg-darker rounded-lg shadow-lg pt-4 px-2 mb-4 flex-none">
            <nav>
              <ul className="flex flex-col w-full">
                {staticNavData.map((item, index) => (
                  <li key={index} className={item.cName}>
                    <Link
                      to={item.path}
                      className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-grey text-lg hover:text-white"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow overflow-hidden">
            <nav>
              <h2 className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-grey text-lg">
                <MdMovieFilter size={"20px"} />
                <span>Your Watchlists</span>
                <button onClick={handleAddList}>
                  <AiOutlinePlus size={"12px"} />
                </button>
              </h2>
              <Scrollbar className="h-[calc(100vh_-_21rem)] overflow-y-hidden">
                <ul className="h-full">
                  {lists.map((list) => ( // Use lists from context
                    <li key={list._id} className="flex justify-center">
                      <button
                        onClick={() => handleItemClick(list)}
                        className="w-full flex items-center space-x-5 text-sm text-white font-semibold mb-2.5 p-2 rounded-lg hover:bg-dark"
                      >
                        <img
                          src={list.content[0]?.image_url || popcornUrl}
                          alt={list.title}
                          className="w-10 h-10 mr-2.5 rounded-lg"
                        />
                        {list.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </Scrollbar>
            </nav>
          </div>
        </div>
        {isPopupOpen && selectedList && (
          <ListPopup
            list={selectedList}
            onClose={handleClosePopup}
            onDeleteList={handleDeleteList} // Use context function
            onRenameList={handleRenameList} // Use context function
          />
        )}
        {isAddListModalOpen && (
          <div className="z-50">
            <NewListModal
              isOpen={isAddListModalOpen}
              onClose={() => setIsAddListModalOpen(false)}
              onCreate={handleCreateList} // Use context function
            />
          </div>
        )}
      </IconContext.Provider>
    </div>
  );
}
