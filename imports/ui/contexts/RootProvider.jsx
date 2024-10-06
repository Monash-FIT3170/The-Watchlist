// src/contexts/RootProvider.jsx

import React from 'react';
import { SearchProvider } from './SearchContext';
import { TrendingProvider } from './TrendingContext';

const RootProvider = ({ children }) => (
  <SearchProvider>
    <TrendingProvider>
      {children}
    </TrendingProvider>
  </SearchProvider>
);

export default RootProvider;
