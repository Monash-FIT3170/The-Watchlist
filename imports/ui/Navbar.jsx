import React, { useState } from "react";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { MdMovieFilter } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useTracker } from 'meteor/react-meteor-data';
import ListPopup from "./ListPopup";
import NewListModal from "./NewListModal";
import usePopup from './usePopup';
import { ListCollection } from "../db/List";
import Scrollbar from './ScrollBar';

const popcornUrl = "./ExampleResources/popcorn.png";

export default function Navbar({ staticNavData }) {
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);

  // Subscribe to the user's lists and subscribed lists
  const { lists, subscribedLists, loading } = useTracker(() => {
    const userId = Meteor.userId();
    const listsHandle = Meteor.subscribe('userLists', userId);
    const subscribedListsHandle = Meteor.subscribe('subscribedLists', userId);

    const lists = ListCollection.find({ userId }).fetch();
    const subscribedLists = ListCollection.find({ subscribers: { $in: [userId] } }).fetch();
    const loading = !listsHandle.ready() || !subscribedListsHandle.ready();

    return { lists, subscribedLists, loading };
  }, []);

  const handleAddList = () => {
    setIsAddListModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <IconContext.Provider value={{ size: "20px" }}>
        <div className="flex flex-col w-66 p-0 mx-2 my-4 h-custom">
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
                <button onClick={handleAddList} className="relative flex justify-center items-center p-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
                  <AiOutlinePlus size={"12px"} />
                </button>
              </h2>
              <Scrollbar className="h-[calc(100vh_-_21rem)] overflow-y-hidden">
                <ul className="h-full">
                  {lists.concat(subscribedLists).map((list) => (
                    <li key={list._id} className="flex justify-start items-center text-sm text-white font-semibold mb-2.5 p-2 rounded-lg hover:bg-dark">
                      <button
                        onClick={() => handleItemClick(list)}
                        className="flex items-center space-x-5 w-full text-left"
                      >
                        <img src={list.content[0]?.image_url || popcornUrl} alt={list.title} className="w-10 h-10 mr-2.5 rounded-lg" />
                        <div className="flex flex-col justify-center">
                          <span className="font-bold">{list.title}</span>
                          <span className="text-xs text-gray-400">{list.userName}</span>
                        </div>
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
            listId={selectedList._id}
            onClose={handleClosePopup}
            onDeleteList={() => Meteor.call('list.delete', { listId: selectedList._id })}
            onRenameList={(newName) => Meteor.call('list.update', { listId: selectedList._id, updateFields: { title: newName } })}
          />
        )}
        {isAddListModalOpen && (
          <div className="z-50">
            <NewListModal
              isOpen={isAddListModalOpen}
              onClose={() => setIsAddListModalOpen(false)}
              onCreate={(title) => Meteor.call('list.create', { title, listType: "Custom", content: [] })}
            />
          </div>
        )}
      </IconContext.Provider>
    </div>
  );
}
