import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // You can include your search logic here, or redirect to a search page with query params.
    navigate(`/${selectedTab}?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="flex flex-col items-center">
        <input
          type="text"
          className="rounded-full border border-gray-300 p-2 w-full max-w-xl"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="tabs-container flex justify-center space-x-4 my-2">
          {['all', 'users', 'movies', 'tv shows', 'lists'].map((tab) => (
            <button
              key={tab}
              className={`tab ${selectedTab === tab ? 'tab-active' : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {/* Add your filters component or UI here */}
      </form>
    </div>
  );
};

export default SearchBar;
