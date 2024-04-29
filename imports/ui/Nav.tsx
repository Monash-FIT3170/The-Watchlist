import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Nav() {
    return (
      <div className="flex">
        <div id="sidebar" className="flex-none w-64 bg-emerald-400" >
          <h1 className="text-3xl">The Watchlist</h1>
          <nav>
            <ul>
              <li>
                <Link to={`/homepage`}>Home</Link>
              </li>
              <li>
                <Link to={`/movielist`}>Movie List</Link>
              </li>
              <li>
                <Link to={`/searchbar`}>Search</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div id="detail" className="flex-none">
            <Outlet />
        </div>
      </div>
    );
  }