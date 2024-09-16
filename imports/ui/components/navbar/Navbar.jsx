import React, { useState } from "react";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { MdMovieFilter, MdChevronRight, MdChevronLeft } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { useTracker } from 'meteor/react-meteor-data';
import ListPopup from "../lists/ListPopup";
import NewListModal from "../../modals/NewListModal";
import usePopup from '../../modals/usePopup';
import { ListCollection } from "../../../db/List";
import Scrollbar from '../scrollbar/ScrollBar';
import { FaAngleDoubleLeft } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";

const popcornUrl = "/images/popcorn.png";

export default function Navbar({ staticNavData, currentUser }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);

  const { lists, subscribedLists, loading } = useTracker(() => {
    const userId = Meteor.userId();
    const listsHandle = Meteor.subscribe('userLists', userId);
    const subscribedListsHandle = Meteor.subscribe('subscribedLists', userId);

    const lists = ListCollection.find({ userId }).fetch();
    const subscribedLists = ListCollection.find({ subscribers: { $in: [userId] } }).fetch();
    const loading = !listsHandle.ready() || !subscribedListsHandle.ready();

    return { lists, subscribedLists, loading };
  }, []);

  const sortedLists = lists.concat(subscribedLists).sort((a, b) => {
    const order = { 'Favourite': 1, 'To Watch': 2, 'Custom': 3 };
    return order[a.listType] - order[b.listType];
  });

  const handleAddList = () => {
    setIsAddListModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen">
      <IconContext.Provider value={{ size: "20px" }}>
        <div className={`flex flex-col ${isCollapsed ? 'w-16' : 'w-66'} p-0 mx-2 my-4 h-custom transition-all duration-300 ease-in-out`}>
          <div className="bg-darker rounded-lg shadow-lg pt-4 px-1 mb-4 flex-none">
            <nav>
              <div className="px-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {isCollapsed && (
                      <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-grey hover:text-white p-2 transition-all duration-300 ease-in-out hover:bg-gray-600 rounded-full">
                        <RxHamburgerMenu size="24px" />
                      </button>
                    )}
                    {!isCollapsed && <span className="text-lg font-bold text-white ml-2">The Watchlist</span>}
                  </div>
                  {!isCollapsed && (
                    <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-grey hover:text-white p-2 ml-0 transition-all duration-300 ease-in-out hover:bg-gray-600 rounded-full">
                      <FaAngleDoubleLeft size="24px" />
                    </button>
                  )}
                </div>
              </div>
              <ul className="flex flex-col w-full">
                {staticNavData.map((item, index) => (
                  <li key={index} className={item.cName}>
                    <Link
                      to={item.path}
                      className="flex items-center space-x-5 ml-0.5 w-full px-4 py-2 mb-2 font-bold text-grey text-lg hover:text-white"
                    >
                      {item.icon}
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow overflow-hidden">
            <nav>
              <h2 className="flex items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-grey text-lg">
                <MdMovieFilter size={"20px"} />
                {!isCollapsed && <span>Your Watchlists</span>}
                {!isCollapsed && (
                  <button onClick={handleAddList} className="p-2 transition-all duration-300 ease-in-out hover:bg-gray-600 rounded-full hover:text-white">
                    <AiOutlinePlus size={"18px"} />
                  </button>
                )}
              </h2>
              <Scrollbar className="h-[calc(100vh_-_25rem)] overflow-y-hidden">
                <ul className="h-full">
                  {sortedLists.map((list) => (
                    <li key={list._id} className={`flex items-center text-sm text-white font-semibold ${isCollapsed ? '' : 'p-2'} rounded-lg hover:bg-dark`}>
                      <button
                        onClick={() => handleItemClick(list)}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-5'} w-full text-left`}
                      >
                        <img src={list.content[0]?.image_url || popcornUrl} alt={list.title} className={`${isCollapsed ? 'my-2.5 ml-2 w-14 h-10 ' : 'w-10 h-10 '} rounded-lg`} />
                        {!isCollapsed && (
                          <div className="flex flex-col justify-center">
                            <span className="truncate max-w-40" title={list.title}>
                              {list.title.length > 20 ? `${list.title.slice(0, 20)}...` : list.title}
                            </span>
                            <span className="text-xs text-gray-400">{list.userName}</span>
                          </div>
                        )}
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
