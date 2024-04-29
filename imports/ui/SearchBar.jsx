import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTab, setSelectedTab] = useState('movies');

  return (
    <div className="search-bar-container">
      <form className="flex flex-col items-center w-full">
        <div className="relative w-full max-w-xl">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <AiOutlineSearch className="text-gray-400" size={20} />
          </span>
          <input
            type="text"
            className={`rounded-full border border-gray-300 pl-10 pr-3 py-3 w-full ${isFocused ? 'border-7B1450' : ''}`}
            placeholder="Search for Content, Lists or Users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        {searchTerm && (
          <div className="bubbles-container flex mt-2 align-left">
            {['movies', 'tv shows', 'users', 'lists'].map((tab) => (
              <div
                key={tab}
                className={`bubble ${selectedTab === tab ? 'bubble-active' : ''}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
