import React, { useState, useEffect } from "react";
import Scrollbar from "../components/scrollbar/ScrollBar.jsx";
import { Meteor } from "meteor/meteor";
import AIPicksHeader from "../components/headers/AIPicksHeader.jsx";
import { useTracker } from "meteor/react-meteor-data";
import ContentList from "../components/lists/ContentList.jsx";
import { RatingCollection } from "../../db/Rating.tsx";
import LoadingNoAnimation from "./LoadingNoAnimation";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


// Main component to render AI Picks, takes currentUser as a prop
const AIPicks = ({ currentUser }) => {
  // Constants for display modes and pagination
  const DISPLAY_MOVIES = "Display Movie";
  const DISPLAY_SHOWS = "Display Show";
  const DISPLAY_TRENDING = "Display Trending";
  const DISPLAY_GENRES = "Display Genres";
  const MOVIES_PER_PAGE = 6; // Number of movies/shows per page
  const MOVIE_COUNT = 5; // Number of movie/show recommendations to show

  const [display, setDisplay] = useState(DISPLAY_MOVIES);
  const [loading, setLoading] = useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState({ movies: [], shows: [] });
  const [trendingContent, setTrendingContent] = useState({ movies: [], shows: [] });
  const [contentMovieNone, setContentMovieNone] = useState(true);
  const [contentTVNone, setContentTVNone] = useState(true);
  const [genreStatistics, setGenreStatistics] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreRecommendations, setGenreRecommendations] = useState({ movies: [], shows: [] });
  const [currentPages, setCurrentPages] = useState({ movies: [], shows: [] }); // Track current page for each of the 5 movies

  const [trendingContentFetched, setTrendingContentFetched] = useState(false);
  const [recommendationsFetched, setRecommendationsFetched] = useState(false);
  const [genreStatisticsFetched, setGenreStatisticsFetched] = useState(false);

  const globalRatings = useTracker(() => {
    const ratingsHandle = Meteor.subscribe("ratings");
    if (!ratingsHandle.ready()) return {};

    const ratings = RatingCollection.find().fetch();
    const ratingMap = ratings.reduce((acc, rating) => {
      if (!acc[rating.contentId]) {
        acc[rating.contentId] = { count: 0, total: 0 };
      }
      acc[rating.contentId].count += 1;
      acc[rating.contentId].total += rating.rating;
      return acc;
    }, {});

    Object.keys(ratingMap).forEach((id) => {
      ratingMap[id].average = (ratingMap[id].total / ratingMap[id].count).toFixed(2);
    });

    return ratingMap;
  }, []);

  useEffect(() => {
    if (display === DISPLAY_TRENDING && !trendingContentFetched) {
      fetchTrendingContent();
    } else if (display !== DISPLAY_TRENDING && !recommendationsFetched) {
      fetchRecommendations();
    }
  }, [display]);

  useEffect(() => {
    if (display === DISPLAY_GENRES && !genreStatisticsFetched) {
      setLoading(true);
      Meteor.call("getUserGenreStatistics", (error, result) => {
        if (error) {
          console.error("Error fetching genre statistics:", error);
          setLoading(false);
        } else {
          setGenreStatistics(result);
          setGenreStatisticsFetched(true);
          setLoading(false);
        }
      });
    }
  }, [display]);

  const fetchTrendingContent = () => {
    setLoading(true);
    Meteor.call("getTrendingContent", (error, result) => {
      if (error) {
        console.error("Error fetching trending content:", error);
        setLoading(false);
      } else {
        setTrendingContent(result);
        setTrendingContentFetched(true);
        setLoading(false);
      }
    });
  };

  const fetchRecommendations = () => {
    setLoading(true);
    Meteor.call("getRecommendations", (error, result) => {
      if (error) {
        console.error("Error fetching recommendations:", error);
        setLoading(false);
      } else {
        processRecommendations(result);
        setRecommendationsFetched(true);
        setLoading(false);
      }
    });
  };

  const fetchRecommendationsByGenre = (genreName) => {
    setLoading(true);
    Meteor.call("getRecommendationsByGenre", genreName, (error, result) => {
      if (error) {
        console.error("Error fetching recommendations by genre:", error);
        setLoading(false);
      } else {
        setGenreRecommendations(result);
        setLoading(false);
      }
    });
  };

  const processRecommendations = ({ movies, shows }) => {
    setContentMovieNone(movies.length === 0);
    setContentTVNone(shows.length === 0);

    const selectedMovies = selectRandomItems(movies, MOVIE_COUNT);
    const movieRecommendations = selectedMovies.map((movie) => ({
      movieTitle: getRandomIntro(movie.title),
      recommendations: movie.recommendations.map((item) => ({
        ...item,
        rating: globalRatings[item.contentId]?.average || 0,
        contentType: "Movie",
      })),
    }));


    const selectedShows = selectRandomItems(shows, MOVIE_COUNT);
  const showRecommendations = selectedShows.map((show) => ({
    showTitle: getRandomIntro(show.title),
    recommendations: show.recommendations.map((item) => ({
      ...item,
      rating: globalRatings[item.contentId]?.average || 0,
      contentType: "TV Show",
    })),
  }));


  


    setDisplayRecommendations({ movies: movieRecommendations, shows: showRecommendations });
    setCurrentPages({
      movies: Array(movieRecommendations.length).fill(0),
      shows: Array(showRecommendations.length).fill(0),
    });
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

  const nextPage = (type, index) => {
    setCurrentPages((prev) => ({
      ...prev,
      [type]: prev[type].map((page, idx) => (idx === index ? page + 1 : page)),
    }));
  };
  
  const prevPage = (type, index) => {
    setCurrentPages((prev) => ({
      ...prev,
      [type]: prev[type].map((page, idx) => (idx === index ? page - 1 : page)),
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-darker">
        <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
        <LoadingNoAnimation
          pageName="The Watchlist"
          pageDesc="Loading Updated AI Recommendations..."
          upperScreen={true}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-darker pb-10">
      <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
      <button
        className="mx-4 my-2 mb-6 px-6 py-3 font-bold text-white bg-gradient-to-r from-magenta to-less-dark rounded-full shadow-lg hover:from-less-dark hover:to-magenta
    focus:outline-none focus:ring-4 focus:ring-magenta transform active:scale-95 transition-transform duration-300"
        onClick={fetchRecommendations}
      >
        Refresh AI Recommendations
      </button>

      <Scrollbar className="w-full overflow-y-auto">
        {display === DISPLAY_TRENDING && (
          <div>
            <div className="px-6 py-2">
              <ContentList
                list={{ title: "Trending Movies", content: trendingContent.movies }}
                isUserOwned={false}
                globalRatings={globalRatings}
                hideShowAllButton={true}
              />
            </div>
            <div className="px-6 py-2">
              <ContentList
                list={{ title: "Trending TV Shows", content: trendingContent.shows }}
                isUserOwned={false}
                globalRatings={globalRatings}
                hideShowAllButton={true}
              />
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
            displayRecommendations.movies.map((movie, movieIndex) => {
              const startIndex = currentPages.movies[movieIndex] * MOVIES_PER_PAGE;
              const currentRecommendations = movie.recommendations.slice(
                startIndex,
                startIndex + MOVIES_PER_PAGE
              );

              return (
                <div key={movieIndex} className="relative px-6 py-2">
                  <ContentList
                    list={{ content: currentRecommendations, title: movie.movieTitle }}
                    isUserOwned={false}
                    globalRatings={globalRatings}
                    hideShowAllButton={true}
                  />

                  {currentPages.movies[movieIndex] > 0 && (
                          <button
                            onClick={() => prevPage('movies', movieIndex)}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent p-2 focus:outline-none z-10 hover:scale-110"
                            aria-label="Previous"
                          >
                            <ChevronLeftIcon className="h-20 w-20 text-white opacity-75 hover:opacity-100 drop-shadow-lg"
                            style={{ mixBlendMode: 'difference' }} />
                          </button>
                        )}
                    {(currentPages.movies[movieIndex] + 1) * MOVIES_PER_PAGE < movie.recommendations.length && (
                      <button
                        onClick={() => nextPage('movies', movieIndex)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent p-2 focus:outline-none z-10 hover:scale-110"
                        aria-label="Next"
                      >
                        <ChevronRightIcon className="h-20 w-20 text-white opacity-75 hover:opacity-100 drop-shadow-lg"
                        style={{ mixBlendMode: 'difference' }} />
                      </button>
                    )}
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
            displayRecommendations.shows.map((show, showIndex) => {
              const startIndex = currentPages.shows[showIndex] * MOVIES_PER_PAGE;
              const currentRecommendations = show.recommendations.slice(
                startIndex,
                startIndex + MOVIES_PER_PAGE
              );
        
              return (
                <div key={showIndex} className="relative px-6 py-2">
                  <ContentList
                    list={{ content: currentRecommendations, title: show.showTitle }}
                    isUserOwned={false}
                    globalRatings={globalRatings}
                    hideShowAllButton={true}
                  />
        
        {currentPages.shows[showIndex] > 0 && (
                          <button
                            onClick={() => prevPage('shows', showIndex)}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent p-2 focus:outline-none z-10  hover:scale-110"
                            aria-label="Previous"
                          >
                            <ChevronLeftIcon className="h-20 w-20 text-white opacity-75 hover:opacity-100 drop-shadow-lg"
                            style={{ mixBlendMode: 'difference' }} />
                          </button>
                        )}
                    {(currentPages.shows[showIndex] + 1) * MOVIES_PER_PAGE < show.recommendations.length && (
                      <button
                        onClick={() => nextPage('shows', showIndex)}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent p-2 focus:outline-none z-10  hover:scale-110"
                        aria-label="Next"
                      >
                        <ChevronRightIcon className="h-20 w-20 text-white opacity-75 hover:opacity-100 drop-shadow-lg"
                        style={{ mixBlendMode: 'difference' }} />
                      </button>
                    )}
                </div>
              );
            })
          )
        )}
        {display === DISPLAY_GENRES && (
          <Scrollbar className="w-full overflow-y-auto">
            <div className="px-8 py-4">
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
                          ? "bg-magenta text-white border-magenta"
                          : "bg-dark text-white border-gray-300"
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
                        list={{ title: "Movies You Might Like", content: genreRecommendations.movies }}
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
                        list={{ title: "TV Shows You Might Like", content: genreRecommendations.shows }}
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
};

export default AIPicks;
