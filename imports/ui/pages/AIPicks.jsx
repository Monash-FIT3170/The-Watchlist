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
  const MOVIES_PER_PAGE = 6; // Display 6 movies per page
  const MOVIE_COUNT = 5; // Always display recommendations for 5 movies

  const [display, setDisplay] = useState(DISPLAY_MOVIES);
  const [loading, setLoading] = useState(true);
  const [displayRecommendations, setDisplayRecommendations] = useState([]); // All recommendations for 5 random movies
  const [currentPages, setCurrentPages] = useState([]); // Track current page for each of the 5 movies
  const [recommendationsFetched, setRecommendationsFetched] = useState(false);

  // Fetch global ratings
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
      ratingMap[id].average = (
        ratingMap[id].total / ratingMap[id].count
      ).toFixed(2);
    });

    return ratingMap;
  }, []);

  useEffect(() => {
    if (!recommendationsFetched) {
      fetchRecommendations();
    }
  }, []);

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

  const processRecommendations = ({ movies }) => {
    // Ensure at least 5 unique movies are selected
    const uniqueMovies = new Set();
    const selectedMovies = [];

    while (selectedMovies.length < MOVIE_COUNT && movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      const movie = movies.splice(randomIndex, 1)[0];

      // Add movie if it is unique
      if (!uniqueMovies.has(movie.title)) {
        uniqueMovies.add(movie.title);
        selectedMovies.push(movie);
      }

      // Break early if less than 5 unique movies are available in the list
      if (
        selectedMovies.length >= MOVIE_COUNT ||
        uniqueMovies.size === movies.length
      ) {
        break;
      }
    }

    // Fill recommendations for each selected movie
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

  // Pagination functions for each movie's recommendations
  const nextPage = (movieIndex) => {
    setCurrentPages((prev) =>
      prev.map((page, idx) => (idx === movieIndex ? page + 1 : page))
    );
  };

  const prevPage = (movieIndex) => {
    setCurrentPages((prev) =>
      prev.map((page, idx) => (idx === movieIndex ? page - 1 : page))
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-darker">
        <AIPicksHeader
          setDisplay={setDisplay}
          currentDisplay={display}
          currentUser={currentUser}
        />
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
      <AIPicksHeader
        setDisplay={setDisplay}
        currentDisplay={display}
        currentUser={currentUser}
      />
      <button
        className="mx-4 my-2 mb-6 px-6 py-3 font-bold text-white bg-gradient-to-r from-magenta to-less-dark rounded-full shadow-lg hover:from-less-dark hover:to-magenta
    focus:outline-none focus:ring-4 focus:ring-magenta transform active:scale-95 transition-transform duration-300"
        onClick={fetchRecommendations}
      >
        Refresh AI Recommendations
      </button>

      <Scrollbar className="w-full overflow-y-auto">
        {displayRecommendations.map((movie, movieIndex) => {
          const startIndex = currentPages[movieIndex] * MOVIES_PER_PAGE;
          const currentRecommendations = movie.recommendations.slice(
            startIndex,
            startIndex + MOVIES_PER_PAGE
          );

          return (
            <div key={movieIndex} className="mb-10">
              {/* Movie Title only in this line */}
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
                  disabled={
                    (currentPages[movieIndex] + 1) * MOVIES_PER_PAGE >=
                    movie.recommendations.length
                  }
                >
                  Next
                </button>
              </div>
            </div>
          );
        })}
      </Scrollbar>
    </div>
  );
};

export default AIPicks;
