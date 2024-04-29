import React from "react";
import { FaRegUserCircle  } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch  } from "react-icons/ai";
import { IconContext } from 'react-icons';
import { Link } from "react-router-dom";


export default function Navbar(props) {
  return (
    <div>
      <IconContext.Provider value={{ size: '20px' }}>
        {/* Sidebar Container with flex layout */}
        <div className="flex-none w-64 p-0 flex flex-col" style={{ margin: '1rem', marginRight: '0.5rem', marginLeft: '0.5rem', height: 'calc(100% - 2rem)' }}>
          
          {/* First Navbar Block */}
          <div className="bg-darker rounded-lg shadow-lg p-2 mb-4 flex-none"> 
            <nav>
              <h1 className="text-3xl mb-4">The Watchlist</h1>
              <ul className="flex flex-col w-full">
                {props.staticNavData.map((item, index) => {
                  return (
                      <li key={index} className={item.cName}>
                          <Link to={item.path} className="w-full flex justify-start items-center space-x-5 h-16">
                              {item.icon}
                              <span>{item.title}</span>
                          </Link>
                      </li>
                  )
                })}
              </ul>
            </nav>
          </div>
          
          {/* Second Navbar Block - filling remaining space */}
          <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow">
            <nav>
              { /* TODO: The following ul component will need to be changed similar to above mapping technique, but potentially using a meteor subscribe to know what lists to render */ }
              <ul>
                <li>
                  <Link to={`/test-content-list`} className="text-light hover-text-magenta">Movie List</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </IconContext.Provider>
    </div>
  );
}
