import React, { useState } from 'react';
import { AiOutlineSearch, AiOutlineFilter, AiOutlineDown} from 'react-icons/ai';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('movies');
  const [showFilters, setShowFilters] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownData = {
    date: {
      options: ["2023", "2022", "2021"],
      selected: ""
    },
    genre: {
      options: ["Action", "Comedy", "Drama"],
      selected: ""
    },
    filter3: {
      options: ["Option 1", "Option 2", "Option 3"],
      selected: ""
    }
  };
  const [dropdownStates, setDropdownStates] = useState(dropdownData);
  
  const toggleDropdown = (tab) => {
    setDropdownOpen(dropdownOpen === tab ? null : tab);
  };
  
  const handleSelection = (tab, option) => {
    const newState = { ...dropdownStates, [tab]: { ...dropdownStates[tab], selected: option } };
    setDropdownStates(newState);
    setDropdownOpen(null); // close the dropdown on selection
  };
  

  

  return (
    <div className="search-bar-container">
      <form className="flex flex-col items-start w-full">
        <div className="flex justify-between items-center w-full max-w-xl">
          <div className="relative flex-grow">
            <input
              type="text"
              className="rounded-full border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
              placeholder="Search for content, lists, or users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <AiOutlineSearch className="text-gray-400" size={20} />
            </span>
          </div>
          <button
            type="button"
            className="ml-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            <AiOutlineFilter size={20} />
          </button>
        </div>
        <div className="bubbles-container flex justify-end mt-2">
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
        {showFilters && (
  <div className="filter-tabs-container flex justify-start mt-2">
    {Object.keys(dropdownStates).map((tab) => (
      <div key={tab} className={`px-4 py-2 cursor-pointer ${dropdownOpen === tab ? 'text-blue-500' : 'text-gray-500'}`} onClick={() => toggleDropdown(tab)}>
        <span className="flex items-center">
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
          <AiOutlineDown className="ml-1" size={16} />
        </span>
        {dropdownOpen === tab && (
          <div className="dropdown-menu absolute mt-1 bg-white border border-gray-300 shadow-lg">
            <ul>
              {dropdownStates[tab].options.map((option, index) => (
                <li key={index} className="p-2 hover:bg-gray-100" onClick={() => handleSelection(tab, option)}>
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
)}

      </form>
    </div>
  );
};

export default SearchBar;
