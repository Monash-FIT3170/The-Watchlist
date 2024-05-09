import React from "react";
import {Link} from "react-router-dom";
import {Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

export default function NavBarList({listData}) {

    return (
        <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow">
            <nav>
              <h2 className="text-2xl text-center mb-4 font-bold">Watch Lists</h2>
                {/* This is temporary and will be changed to fetch data from the database */}
              <ul className="overflow-y-scroll h-96 dark:[color-scheme:dark]">
                {listData.map((list) => (
                  <li key={list.id} className="flex justify-center">
                    <Link to={`/${list.listId}`} className="w-full flex justify-start items-center text-neutral-500 p-3 rounded-2xl hover:bg-dark hover:text-white font-bold text-lg focus:bg-dark focus:text-white">
                      {list.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
        </div>
    );
}