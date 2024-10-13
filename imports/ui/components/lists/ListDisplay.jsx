import React from 'react';
import ListPopup from './ListPopup';
import usePopup from '../../modals/usePopup';

const ListDisplay = ({ listData, heading }) => {
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

    const popcornUrl = "./images/popcorn.png";

    return (
        <div className="w-full bg-darker px-2 py-5 rounded-lg">
            {/* Conditionally render heading if provided */}
            {heading && (
                <h2 className="text-white text-2xl font-semibold mb-4">{heading}</h2>
            )}
            {rows.map((row, index) => (
                <div key={index} className="flex justify-start space-x-4 mb-4 last:mb-0"> 
                    {row.map(list => (
                        <div 
                            key={list._id} 
                            onClick={() => handleItemClick(list)} 
                            className="flex-1 bg-dark min-w-[24%] max-w-[24%] flex items-center rounded-lg hover:bg-less-dark transition-colors duration-150 cursor-pointer"
                        >
                            <img
                                src={list.listUrl || list.content[0]?.image_url || popcornUrl}
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
                    listId={selectedList._id} // Pass the list ID
                    onClose={handleClosePopup}
                    onDeleteList={() => Meteor.call('list.delete', { listId: selectedList._id })} // Call the delete method
                    onRenameList={(newName) => Meteor.call('list.update', { listId: selectedList._id, updateFields: { title: newName } })} // Call the rename method
                />
            )}
        </div>
    );
}

export default ListDisplay;