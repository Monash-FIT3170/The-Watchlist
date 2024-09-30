import React, { useState, useEffect } from 'react';
import Scrollbar from '../components/scrollbar/ScrollBar.jsx';
import { Meteor } from 'meteor/meteor';
import AIPicksHeader from '../components/headers/AIPicksHeader.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import ContentList from '../components/lists/ContentList.jsx';
import { RatingCollection } from '../../db/Rating.tsx';

const AIPicks = ({ currentUser }) => {
  const DISPLAY_MOVIES = "Display Movie";
  const DISPLAY_SHOWS = "Display Show";
  const NUM_LIST_SLOTS = 8;

  const [display, setDisplay] = useState(DISPLAY_MOVIES);
  const [loading, setLoading] = useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState({ movies: [], shows: [] });
  const [contentMovieNone, setContentMovieNone] = useState(true);
  const [contentTVNone, setContentTVNone] = useState(true);

  // Use useTracker to reactively fetch global ratings
  const globalRatings = useTracker(() => {
    const ratingsHandle = Meteor.subscribe('ratings'); // Subscribe to ratings collection
    if (!ratingsHandle.ready()) {
      return {}; // Return an empty object while subscription is loading
    }
    const ratings = RatingCollection.find().fetch(); // Fetch all ratings
    const ratingMap = ratings.reduce((acc, rating) => {
      if (!acc[rating.contentId]) {
        acc[rating.contentId] = {
          count: 0,
          total: 0,
        };
      }
      acc[rating.contentId].count += 1;
      acc[rating.contentId].total += rating.rating;
      return acc;
    }, {});

    for (const id in ratingMap) {
      ratingMap[id].average = (ratingMap[id].total / ratingMap[id].count).toFixed(2);
    }

    return ratingMap;
  }, []); // No dependencies needed; reactivity is handled by the subscription

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
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-magenta"></div>
          <p className="text-xl font-semibold mt-4">Loading Updated AI Recommendations...</p>
          <p className="text-gray-400 mt-2">Please wait a moment while we fetch your content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-darker pb-10">
      <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
      <button
        className="mx-4 my-2 px-6 py-3 font-bold text-white bg-gradient-to-r from-magenta to-less-dark rounded-full shadow-lg hover:from-less-dark hover:to-magenta
          focus:outline-none focus:ring-4 focus:ring-magenta transform active:scale-95 transition-transform duration-300"
        onClick={refreshRecommendations}
      >
        Refresh AI Recommendations
      </button>
      <Scrollbar className="w-full overflow-y-auto p-4">
        {display === DISPLAY_MOVIES && (
          contentMovieNone ? (
            <div className="flex flex-col items-center justify-center mt-10 p-6 rounded-lg shadow-lg">
              <p className="text-white text-2xl font-semibold mb-2">Not enough Movies yet.</p>
              <p className="text-gray-400 text-lg">Add some to your favourites or watchlist to get started!</p>
            </div>
          ) : (
            displayRecommendations.movies.map(list => {
              console.log('Rendering Movie List:', list);
              return (
                <div key={list.listId} className="bg-darker-light shadow-lg rounded-lg p-2 mr-4">
                  <ContentList list={list} isUserOwned={false} hideShowAllButton={true} globalRatings={globalRatings} />
                </div>
              );
            })
          )
        )}
        {display === DISPLAY_SHOWS && (
          contentTVNone ? (
            <div className="flex flex-col items-center justify-center mt-10 p-6 rounded-lg shadow-lg">
              <p className="text-white text-2xl font-semibold mb-2">Not enough Shows yet.</p>
              <p className="text-gray-400 text-lg">Add some to your favourites or watchlist to get started!</p>
            </div>
          ) : (
            displayRecommendations.shows.map(list => {
              console.log('Rendering Show List:', list);
              return (
                <div key={list.listId} className="bg-darker-light shadow-lg rounded-lg mb-6 p-4 mr-4">
                  <ContentList list={list} isUserOwned={false} hideShowAllButton={true} globalRatings={globalRatings} />
                </div>
              );
            })
          )
        )}
      </Scrollbar>
    </div>
  );
}

export default AIPicks;