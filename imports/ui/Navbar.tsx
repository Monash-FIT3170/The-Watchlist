import React from "react";
import { IconContext } from 'react-icons';
import { Link } from "react-router-dom";
import NavBarList from "./NavbarList";


export default function Navbar({ staticNavData, listData }) {
  return (
    <div>
      <IconContext.Provider value={{ size: '20px' }}>
        {/* Sidebar Container with flex layout */}
        <div className="flex-none w-64 p-0 flex flex-col" style={{ margin: '1rem', marginRight: '0.5rem', marginLeft: '0.5rem', height: 'calc(100% - 2rem)' }}>
          
          {/* First Navbar Block */}
          <div className="bg-darker rounded-lg shadow-lg pt-4 px-2 mb-4 flex-none"> 
            <nav>
              <h2 className="text-2xl text-center mb-4 font-bold">The Watchlist</h2>
              <ul className="flex flex-col w-full">
                {staticNavData.map((item, index) => {
                  return (
                      <li key={index} className={item.cName}>
                          <Link to={item.path} className="w-full flex justify-start items-center space-x-5 text-white font-semibold bg-dark mb-3 px-4 py-2 rounded-lg shadow-nav hover:shadow-nav-inner">
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
          <NavBarList listData={listData}/>
          
        </div>
      </IconContext.Provider>
    </div>
  );
}
