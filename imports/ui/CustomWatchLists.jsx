import React from 'react';
import { Link } from "react-router-dom";
import ListPopup from './ListPopup';
import usePopup from './usePopup';

export default function CustomWatchLists({listData: watchlists}) {
    // Divide the listData into rows of 4 
    const itemsPerRow = 4;
    let rows = [];
    let currentRow = []; 
    const { isPopupOpen, selectedList, handleItemClick, handleClosePopup } = usePopup();

    for (let i = 0; i < watchlists.length; i++) {
        // Push the current watchlist to the current row array
        currentRow.push(watchlists[i]);

        // If the current row is full (contains 4 elements) or it is the last iteration
        if (currentRow.length === itemsPerRow || i === watchlists.length - 1) {
            // Push the current row to the rows array
            rows.push(currentRow);

            // Reset the current row to an empty array for the next iteration
            currentRow = [];
        }
    }

    return (
        <div className="bg-darker px-2 py-5 rounded-lg">
            <h2 className="text-white text-2xl font-bold mb-4 px-2">Custom Watchlists</h2>
            {rows.map((row, index) => (
                <div key={index} className="flex justify-between">
                    {row.map(watchlist => (
                        <div key={watchlist._id} className="w-1/4 px-2">
                            <button onClick={() => handleItemClick(watchlist)} className=" mb-4 flex px-4 items-center rounded-lg hover:bg-dark">
                                <img
                                    src={watchlist.content[0]?.image_url || './path_to_default_image.jpg'}
                                    alt={watchlist.title}
                                    className="w-16 h-16 rounded-lg mr-2"
                                />
                                <p className="text-white text-sm font-semibold">{watchlist.title}</p>
                            </button>
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