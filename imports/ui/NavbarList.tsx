import React from "react";
import { Link } from "react-router-dom";
import Scrollbar from './ScrollBar'; // Import the Scrollbar component

export default function NavBarList({ listData }) {
  return (
    <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow">
      <nav>
        <h2 className="text-2xl text-center mb-4 font-bold">Watch Lists</h2>
        <Scrollbar className="h-96 dark:[color-scheme:dark]">
          <ul className="overflow-y-auto">
            {listData.map((list) => (
              <li key={list.id} className="flex justify-center">
                <Link to={`/${list._id}`} className="w-full flex justify-start items-center text-neutral-500 p-3 rounded-2xl hover:bg-dark hover:text-white font-bold text-lg focus:bg-dark focus:text-white">
                  {list.title}
                </Link>
              </li>
            ))}
          </ul>
        </Scrollbar>
      </nav>
    </div>
  );
}
