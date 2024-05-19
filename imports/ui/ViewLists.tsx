import React from 'react';
import { MdMovieFilter } from 'react-icons/md';
import Scrollbar from './ScrollBar'; // Import the Scrollbar component

export default function ViewLists({ listData }) {
  return (
    <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow overflow-hidden">
      <nav>
        <h2 className="flex justify-start items-center space-x-5 w-full px-4 py-2 mb-2 font-bold text-grey text-lg">
          <MdMovieFilter size={"20px"} /><span>Your Watchlists</span>
        </h2>
        <Scrollbar className="h-[calc(100vh_-_21rem)]">
          <ul className="overflow-y-auto">
            {listData.map((list) => (
              <li key={list.listId} className="flex justify-center">
                <img
                  src={list.content[0]?.image_url || './path_to_default_image.jpg'}
                  alt={list.title}
                  className="w-10 h-10 mr-2.5 rounded-lg"
                />
                {list.title}
              </li>
            ))}
          </ul>
        </Scrollbar>
      </nav>
    </div>
  );
}
