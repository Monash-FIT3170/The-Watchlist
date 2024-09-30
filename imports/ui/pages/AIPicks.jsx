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
  const DISPLAY_TRENDING = "Display Trending";
  const DISPLAY_GENRES = "Display Genres";
  const NUM_LIST_SLOTS = 8;

  const [display, setDisplay] = useState(DISPLAY_MOVIES);
  const [loading, setLoading] = useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState({ movies: [], shows: [] });
  const [trendingContent, setTrendingContent] = useState({ movies: [], shows: [] });
  const [contentMovieNone, setContentMovieNone] = useState(true);
  const [contentTVNone, setContentTVNone] = useState(true);
  const [genreStatistics, setGenreStatistics] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreRecommendations, setGenreRecommendations] = useState({ movies: [], shows: [] });


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
    if (display === DISPLAY_TRENDING) {
      fetchTrendingContent();
    } else {
      fetchRecommendations();
    }
  }, [display]);

  useEffect(() => {
    if (display === DISPLAY_GENRES) {
      setLoading(true);
      Meteor.call('getUserGenreStatistics', (error, result) => {
        if (error) {
          console.error('Error fetching genre statistics:', error);
          setLoading(false);
        } else {
          setGenreStatistics(result);
          setLoading(false);
        }
      });
    }
  }, [display]);

  const fetchTrendingContent = () => {
    setLoading(true);
    Meteor.call('getTrendingContent', (error, result) => {
      if (error) {
        console.error("Error fetching trending content:", error);
        setLoading(false);
      } else {
        setTrendingContent(result);
        setLoading(false);
      }
    });
  };

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

  const fetchRecommendationsByGenre = (genreName) => {
    setLoading(true);
    Meteor.call('getRecommendationsByGenre', genreName, (error, result) => {
      if (error) {
        console.error('Error fetching recommendations by genre:', error);
        setLoading(false);
      } else {
        setGenreRecommendations(result);
        setLoading(false);
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
    if (display === DISPLAY_TRENDING) {
      fetchTrendingContent();
    } else {
      fetchRecommendations();
    }
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
      <Scrollbar className="w-full overflow-y-auto">
        {display === DISPLAY_TRENDING && (
          <div>
            <div className="px-6 py-2">
              <ContentList list={{ title: 'Trending Movies', content: trendingContent.movies }} isUserOwned={false} globalRatings={globalRatings} hideShowAllButton={true} />
            </div>
            <div className="px-6 py-2">
              <ContentList list={{ title: 'Trending TV Shows', content: trendingContent.shows }} isUserOwned={false} globalRatings={globalRatings} hideShowAllButton={true} />
            </div>
          </div>
        )}
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
                <div key={list.listId} className="bg-darker-light shadow-lg rounded-lg p-4 mr-4">
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
        {display === DISPLAY_GENRES && (
          <Scrollbar className="w-full overflow-y-auto">
            <div className="px-8 py-4">
              {/* Explanation Alert Box */}
              <div className="bg-blue-500 bg-opacity-10 border border-blue-500 text-blue-300 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Understanding Your Top Genres:</strong>
                <span className="block sm:inline ml-1">
                  The numbers next to each genre indicate how many times you've interacted with content from that genre through ratings or adding to your lists. Select a genre to see personalised recommendations!
                </span>
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">Your Top Genres</h2>
              {genreStatistics.length > 0 ? (
                <div className="flex flex-wrap">
                  {genreStatistics.map((genreStat) => (
                    <button
                      key={genreStat.genre}
                      className={`m-2 px-4 py-2 rounded-full border ${selectedGenre === genreStat.genre
                          ? 'bg-magenta text-white border-magenta'
                          : 'bg-dark text-white border-gray-300'
                        }`}
                      onClick={() => {
                        setSelectedGenre(genreStat.genre);
                        fetchRecommendationsByGenre(genreStat.genre);
                      }}
                    >
                      {genreStat.genre} ({genreStat.count})
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">
                  You haven't interacted with any genres yet. Start rating or adding content to see recommendations here!
                </p>
              )}
              {selectedGenre && (
                <div className="mt-6">
                  <h2 className="text-white text-2xl font-bold mb-4">Recommendations for "{selectedGenre}"</h2>
                  <div className="py-2">
                    {genreRecommendations.movies.length > 0 ? (
                      <ContentList
                        list={{ title: 'Movies You Might Like', content: genreRecommendations.movies }}
                        isUserOwned={false}
                        globalRatings={globalRatings}
                        hideShowAllButton={true}
                      />
                    ) : (
                      <p className="text-gray-400">No movie recommendations available for this genre.</p>
                    )}
                  </div>
                  <div className="py-2">
                    {genreRecommendations.shows.length > 0 ? (
                      <ContentList
                        list={{ title: 'TV Shows You Might Like', content: genreRecommendations.shows }}
                        isUserOwned={false}
                        globalRatings={globalRatings}
                        hideShowAllButton={true}
                      />
                    ) : (
                      <p className="text-gray-400">No TV show recommendations available for this genre.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Scrollbar>
        )}

      </Scrollbar>
    </div>
  );
}

export default AIPicks;