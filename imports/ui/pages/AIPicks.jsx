// AIPicks.jsx

import React, { useState, useEffect } from 'react';
import ContentListAI from '../components/lists/ContentListAI.jsx';
import Scrollbar from '../components/scrollbar/ScrollBar.jsx';
import { Meteor } from 'meteor/meteor';
import AIPicksHeader from '../components/headers/AIPicksHeader.jsx';
import { useTracker } from 'meteor/react-meteor-data';

export default function AIPicks() {
  const DISPLAY_MOVIES = "Display Movie";
  const DISPLAY_SHOWS = "Display Show";
  const NUM_LIST_SLOTS = 5;

  const [display, setDisplay] = useState(DISPLAY_MOVIES);
  const [globalRatings, setGlobalRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState({ movies: [], shows: [] });
  const [contentMovieNone, setContentMovieNone] = useState(true);
  const [contentTVNone, setContentTVNone] = useState(true);

  const currentUser = useTracker(() => Meteor.user(), []);

  useEffect(() => {
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (!error) {
        console.log('Global Ratings:', result);
        setGlobalRatings(result);
      } else {
        console.error("Error fetching global ratings:", error);
      }
    });
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = () => {
    console.log('Fetching recommendations...');
    setLoading(true);
    Meteor.call('getRecommendations', (error, result) => {
      if (error) {
        console.error("Error fetching recommendations:", error);
        setLoading(false);
      } else {
        console.log('Received recommendations:', result);
        processRecommendations(result);
      }
    });
  };

  const processRecommendations = ({ movies, shows }) => {
    console.log('Processing recommendations:', { movies, shows });

    setContentMovieNone(movies.length === 0);
    setContentTVNone(shows.length === 0);

    const updatedMovies = movies.map(recommendation => ({
      listId: `RecommendedMovies-${recommendation.title}`,
      title: getRandomIntro(recommendation.title),
      content: selectRandomItems(recommendation.recommendations, NUM_LIST_SLOTS).map(item => ({
        ...item,
        rating: globalRatings[item.contentId]?.average || 0,
        contentType: "Movie",
      })),
    }));

    const updatedShows = shows.map(recommendation => ({
      listId: `RecommendedShows-${recommendation.title}`,
      title: getRandomIntro(recommendation.title),
      content: selectRandomItems(recommendation.recommendations, NUM_LIST_SLOTS).map(item => ({
        ...item,
        rating: globalRatings[item.contentId]?.average || 0,
        contentType: "TV Show",
      })),
    }));

    console.log('Updated Movies:', updatedMovies);
    console.log('Updated Shows:', updatedShows);

    setDisplayRecommendations({ movies: updatedMovies, shows: updatedShows });
    setLoading(false);
  };

  const selectRandomItems = (array, numItems) => {
    const selectedItems = [];
    const arrayCopy = [...array];

    while (selectedItems.length < numItems && arrayCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * arrayCopy.length);
      selectedItems.push(arrayCopy.splice(randomIndex, 1)[0]);
    }
    return selectedItems;
  };

  const getRandomIntro = (title) => {
    const randomIntros = [
      `Because you liked ${title}, you'll love these:`,
      `Based on your love for ${title}, we recommend:`,
      `${title} was a great choice! Here are more:`,
      `If you enjoyed ${title}, check out these:`,
      `We also loved ${title}, and here are the AI's other favourites:`,
    ];
    const randomIndex = Math.floor(Math.random() * randomIntros.length);
    return randomIntros[randomIndex];
  };

  const refreshRecommendations = () => {
    console.log('Refreshing recommendations...');
    fetchRecommendations();
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-darker">
        <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
          <div className="-mt-52 animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 mb-4"></div>
          <p className="text-xl font-semibold">Loading Updated AI Recommendations...</p>
          <p className="text-gray-400 mt-2">Please wait a moment while we fetch your content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
      <button
        className="mx-4 px-6 py-3 font-bold text-white bg-gradient-to-r from-magenta to-less-dark rounded-full shadow-lg hover:from-less-dark hover:to-magenta
          focus:outline-none focus:ring-4 focus:ring-purple-300 transform active:scale-95 transition-transform duration-200"
        onClick={refreshRecommendations}
      >
        Refresh AI Recommendations
      </button>
      <Scrollbar className="w-full overflow-y-auto">
        {display === DISPLAY_MOVIES && (
          contentMovieNone ? (
            <div className="px-8 py-2 mt-10 text-white text-3xl">
              Not enough Movies yet. Add some to your favourites or watchlist to get started!
            </div>
          ) : (
            displayRecommendations.movies.map(list => {
              console.log('Rendering Movie List:', list);
              return (
                <div key={list.listId} className="px-8 py-2">
                  <ContentListAI list={list} isUserOwned={false} />
                </div>
              );
            })
          )
        )}
        {display === DISPLAY_SHOWS && (
          contentTVNone ? (
            <div className="px-8 py-2 mt-10 text-white text-3xl">
              Not enough Shows yet. Add some to your favourites or watchlist to get started!
            </div>
          ) : (
            displayRecommendations.shows.map(list => {
              console.log('Rendering Show List:', list);
              return (
                <div key={list.listId} className="px-8 py-2">
                  <ContentListAI list={list} isUserOwned={false} />
                </div>
              );
            })
          )
        )}
      </Scrollbar>
    </div>
  );
}
