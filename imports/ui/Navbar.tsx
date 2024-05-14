import React, {useState} from "react";
import { IconContext } from 'react-icons';
import { Link } from "react-router-dom";
import { MdMovieFilter } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import ListPopup from "./ListPopup";



export default function Navbar({ staticNavData, listData }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedList, setSelectedList] = useState(null);

    const handleItemClick = (list) => {
      setSelectedList(list);
      setIsPopupOpen(true);
    };
  
    const handleClosePopup = () => {
      setIsPopupOpen(false);
      setSelectedList(null);
    };
  

  return (
    <div className="flex flex-col h-screen"> 
      <IconContext.Provider value={{ size: '20px' }}>
        <div className="flex flex-col w-64 p-0 mx-2 my-4 h-custom"> {/* Use viewport height (vh) if full height is needed */}

          <div className="bg-darker rounded-lg shadow-lg pt-4 px-2 mb-4 flex-none">
            <nav>
              <ul className="flex flex-col w-full">
                {staticNavData.map((item, index) => (
                  <li key={index} className={item.cName}>
                    <Link to={item.path} className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-grey text-lg hover:text-white">
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
                 <MdMovieFilter size={"20px"}/><span>Your Watchlists</span></h2>
              {/* Horrendous height calculation below, better solution required */}
              <ul className="h-[calc(100vh_-_21rem)] overflow-y-hidden hover:overflow-y-scroll hover:scrollbar-webkit">
                {listData.map((list) => (
                  <li key={list.listId} className="flex justify-center">
                    <button 
                    onClick={() => handleItemClick(list)}
                    className="w-full flex items-center space-x-5 text-sm text-white font-semibold mb-2.5 p-2 rounded-lg hover:bg-dark"
                    >
                      <img
                        src={list.content[0]?.image_url || './path_to_default_image.jpg'}
                        alt={list.title}
                        className="w-10 h-10 mr-2.5 rounded-lg"
                      />
                      {list.title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>
      </IconContext.Provider>

      {isPopupOpen && selectedList && (
        <ListPopup
          list={selectedList}
          onClose={handleClosePopup}
        />
      )}

    </div>
  );
}