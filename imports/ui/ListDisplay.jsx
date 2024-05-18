import React from 'react';
import { Link } from "react-router-dom";
import ListPopup from './ListPopup';
import usePopup from './usePopup';

export default function ListDisplay({ listData }) {

    const { 
        isPopupOpen, 
        selectedList, 
        handleItemClick, 
        handleClosePopup
      } = usePopup();


    const itemsPerRow = 4;
    let rows = [];

    // Building rows from listData fresh on each render
    for (let i = 0; i < listData.length; i += itemsPerRow) {
        rows.push(listData.slice(i, i + itemsPerRow));
    }

    return (
        <div className="w-full bg-darker px-2 py-5 rounded-lg">
            {rows.map((row, index) => (
                <div key={index} className="flex justify-start space-x-4 mb-4 last:mb-0"> 
                    {row.map(list => (
                        <div 
                        key={list._id} 
                        onClick={() => handleItemClick(list)} 
                        className="flex-1 bg-dark min-w-[24%] max-w-[24%] flex items-center rounded-lg hover:bg-less-dark transition-colors duration-150 cursor-pointer"
                      >
                        <img
                          src={list.content[0]?.image_url || './path_to_default_image.jpg'}
                          alt={list.title}
                          className="w-16 h-16 rounded-lg mr-2"
                        />
                        <p className="text-white text-sm font-semibold">{list.title}</p>
                      </div>
            ))}
        </div>
        ))}
        {isPopupOpen && selectedList && (
          <ListPopup
            list={selectedList}
            onClose={handleClosePopup}
            onDeleteList={() => console.log("Delete list")}
            onRenameList={() => console.log("Rename list")}
          />
        )}
        </div>
    );
}
