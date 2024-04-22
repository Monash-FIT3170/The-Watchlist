import React, {useState, useEffect} from 'react';
import { FaSearch } from 'react-icons/fa';
import "./SearchBar.css";

export const SearchBar = () => {
  return ( 
    <div className="searchbar">
      <div className='searchbar-wrapper'>
        <FaSearch id= "search-icon"/>
        <input placeholder="Type to search..."/>
      </div>
      <h1> Recent Searches </h1>
    </div>
      
 );
}

