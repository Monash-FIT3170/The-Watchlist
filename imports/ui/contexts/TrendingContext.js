// src/contexts/TrendingContext.jsx

import React, { createContext, useState, useEffect, useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

// Create the Context
export const TrendingContext = createContext();

// Define the Provider Component
export const TrendingProvider = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVs, setTrendingTVs] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);
  const [lastFetched, setLastFetched] = useState(0);

  // Cache duration in milliseconds (1 hour)
  const TRENDING_CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour

  useEffect(() => {
    const now = Date.now();
    if (now - lastFetched < TRENDING_CACHE_DURATION && trendingMovies.length > 0 && trendingTVs.length > 0) {
      // Cached data is still valid
      console.log('Using cached trending data');
      setTrendingLoading(false);
      return;
    }

    console.log('Fetching trending data from server');
    Meteor.call('getTrendingContent', (error, result) => {
      if (error) {
        console.error('Error fetching trending content:', error);
        setTrendingError(error);
        setTrendingLoading(false);
      } else {
        setTrendingMovies(result.movies.sort((a, b) => b.popularity - a.popularity).slice(0, 10));
        setTrendingTVs(result.shows.sort((a, b) => b.popularity - a.popularity).slice(0, 10));
        setLastFetched(now);
        setTrendingLoading(false);
      }
    });
  }, [lastFetched, TRENDING_CACHE_DURATION, trendingMovies.length, trendingTVs.length]);

  const value = useMemo(() => ({
    trendingMovies,
    trendingTVs,
    trendingLoading,
    trendingError,
  }), [trendingMovies, trendingTVs, trendingLoading, trendingError]);

  return (
    <TrendingContext.Provider value={value}>
      {children}
    </TrendingContext.Provider>
  );
};

TrendingProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
