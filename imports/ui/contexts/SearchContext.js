// SearchContext.js
import React, { createContext, useState } from 'react';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchState, setSearchState] = useState({
    selectedTab: 'Movies',
    searchTerm: '',
    debouncedSearchTerm: '',
    currentPage: 0,
    totalPages: 0,
    filteredMovies: [],
    filteredTVShows: [],
    filteredLists: [],
    users: [],
    globalRatings: {},
  });

  return (
    <SearchContext.Provider value={{ searchState, setSearchState }}>
      {children}
    </SearchContext.Provider>
  );
};
