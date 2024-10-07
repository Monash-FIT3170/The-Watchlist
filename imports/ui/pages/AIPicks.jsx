import React, { useState, useEffect } from "react";
import Scrollbar from "../components/scrollbar/ScrollBar.jsx";
import { Meteor } from "meteor/meteor";
import AIPicksHeader from "../components/headers/AIPicksHeader.jsx";
import { useTracker } from "meteor/react-meteor-data";
import ContentList from "../components/lists/ContentList.jsx";
import { RatingCollection } from "../../db/Rating.tsx";
import LoadingNoAnimation from "./LoadingNoAnimation";

const AIPicks = ({ currentUser }) => {
  const DISPLAY_MOVIES = "Display Movie";
  const DISPLAY_SHOWS = "Display Show";
  const DISPLAY_TRENDING = "Display Trending";
  const DISPLAY_GENRES = "Display Genres";
  const MOVIES_PER_PAGE = 6;
  const MOVIE_COUNT = 5;

  const [display, setDisplay] = useState(DISPLAY_MOVIES);
  const [loading, setLoading] = useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState({ movies: [], shows: [] });
  const [trendingContent, setTrendingContent] = useState({ movies: [], shows: [] });
  const [contentMovieNone, setContentMovieNone] = useState(true);
  const [contentTVNone, setContentTVNone] = useState(true);
  const [genreStatistics, setGenreStatistics] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreRecommendations, setGenreRecommendations] = useState({ movies: [], shows: [] });
  const [currentPages, setCurrentPages] = useState([]); // Track current page for each of the 5 movies

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
    const recommendations = selectedMovies.map((movie) => ({
      movieTitle: movie.title,
      recommendations: movie.recommendations.map((item) => ({
        ...item,
        rating: globalRatings[item.contentId]?.average || 0,
        contentType: "Movie",
      })),
    }));

    setDisplayRecommendations(recommendations);
    setCurrentPages(Array(MOVIE_COUNT).fill(0)); // Initialize current page as 0 for each movie
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

  const nextPage = (movieIndex) => {
    setCurrentPages((prev) => prev.map((page, idx) => (idx === movieIndex ? page + 1 : page)));
  };

  const prevPage = (movieIndex) => {
    setCurrentPages((prev) => prev.map((page, idx) => (idx === movieIndex ? page - 1 : page)));
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
            displayRecommendations.map((movie, movieIndex) => {
              const startIndex = currentPages[movieIndex] * MOVIES_PER_PAGE;
              const currentRecommendations = movie.recommendations.slice(
                startIndex,
                startIndex + MOVIES_PER_PAGE
              );

              return (
                <div key={movieIndex} className="mb-10">
                  <h2 className="text-white text-2xl font-bold mb-4">{`Because you liked ${movie.movieTitle}, here are more:`}</h2>
                  <ContentList
                    list={{ content: currentRecommendations }}
                    isUserOwned={false}
                    globalRatings={globalRatings}
                    hideShowAllButton={true}
                  />

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => prevPage(movieIndex)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                      disabled={currentPages[movieIndex] === 0}
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => nextPage(movieIndex)}
                      className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
                      disabled={(currentPages[movieIndex] + 1) * MOVIES_PER_PAGE >= movie.recommendations.length}
                    >
                      Next
                    </button>
                  </div>
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
            displayRecommendations.shows.map((list) => (
              <div key={list.listId} className="bg-darker-light shadow-lg rounded-lg mb-6 p-4 mr-4">
                <ContentList list={list} isUserOwned={false} hideShowAllButton={true} globalRatings={globalRatings} />
              </div>
            ))
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
