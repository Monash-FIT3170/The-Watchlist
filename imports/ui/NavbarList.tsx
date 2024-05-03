import React from "react";
import {Link} from "react-router-dom";
import {Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

export default function NavBarList({listData}) {

    return (
        <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow">
            <nav>
              <h2 className="text-2xl text-center mb-4 font-bold">Watch Lists</h2>
                {/* This is temporary and will be changed to fetch data from the database */}
              <ul>
                {listData.map((list) => (
                  <li key={list.id} className="flex justify-center">
                    <Link to={`/${list.id}`} className="w-5/6 flex justify-start items-center space-x-5 text-sm text-white bg-dark mb-3 p-2 rounded-lg shadow-nav hover:shadow-nav-inner">
                      {list.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
        </div>
    );
}