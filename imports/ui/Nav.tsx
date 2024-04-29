import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function Nav() {
  return (
    <div className="flex h-screen overflow-hidden bg-darkest text-light">
      {/* Sidebar Container with flex layout */}
      <div className="flex-none w-64 p-0 flex flex-col" style={{ margin: '1rem', marginRight: '0.5rem', marginLeft: '0.5rem', height: 'calc(100% - 2rem)' }}>
        
        {/* First Navbar Block */}
        <div className="bg-darker rounded-lg shadow-lg p-2 mb-4 flex-none"> 
          <nav>
          <h1 className="text-3xl mb-4">The Watchlist</h1>
            <ul>
              <li>
                <Link to={`/homepage`} className="text-light hover-text-magenta">Home</Link>
              </li>
              <li>
                <Link to={`/searchbar`} className="text-light hover-text-magenta">Search</Link>
              </li>
            </ul>
          </nav>
        </div>
        
        {/* Second Navbar Block - filling remaining space */}
        <div className="bg-darker rounded-lg shadow-lg p-2 flex-grow">
          <nav>
            <ul>
              <li>
                <Link to={`/movielist`} className="text-light hover-text-magenta">Movie List</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      
      {/* Detail Section */}
      <div id="detail" className="flex-auto p-4 bg-darker rounded-lg shadow-lg" style={{ margin: '1rem',  marginRight: '0.5rem', marginLeft: '0.5rem', height: 'calc(100% - 2rem)' }}>
        <Outlet />
      </div>
    </div>
  );
}
