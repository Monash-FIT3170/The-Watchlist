// Home.jsx

import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import HomeList from '../components/lists/HomeList';
import { RatingCollection } from '../../db/Rating';
import { ListCollection } from '../../db/List';
import { Meteor } from 'meteor/meteor';
import Carousel from '../components/carousel/Carousel';

const Home = ({ currentUser }) => {
  const { lists, ratings, loading } = useTracker(() => {
    const userId = Meteor.userId();
    const listsHandle = Meteor.subscribe('userLists', userId);
    const ratingsHandle = Meteor.subscribe('userRatings', userId);

    const lists = ListCollection.find({ userId }).fetch();
    const ratings = RatingCollection.find({ userId }).fetch();
    const loading = !listsHandle.ready() || !ratingsHandle.ready();

    return { lists, ratings, loading };
  }, []);

  const [trendingContent, setTrendingContent] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [trendingTVs, setTrendingTVs] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    Meteor.call('getTrendingContent', (error, result) => {
      if (error) {
        console.error('Error fetching trending content:', error);
        setTrendingLoading(false);
      } else {
        setTrendingMovies(result.movies.slice(0, 10));
        setTrendingTVs(result.shows.slice(0, 10))
        const combinedTrending = [...result.movies, ...result.shows];
        console.log("combinedTrending, ", combinedTrending)
        const shuffledTrending = combinedTrending.sort(() => 0.5 - Math.random());
        setTrendingContent(shuffledTrending);
        setTrendingLoading(false);
      }
    });
  }, []);

  const getUserRatingForContent = (contentId) => {
    const rating = ratings.find((r) => r.contentId === contentId);
    return rating ? rating.rating : 0;
  };

  const favouritesList = lists.filter((list) => list.listType === 'Favourite');
  const toWatchList = lists.filter((list) => list.listType === 'To Watch');

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <div className="absolute top-8 right-10">
        <ProfileDropdown user={currentUser} />
      </div>

      {/* Carousel of trending content */}
      {trendingLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading Trending Content...</div>
        </div>
      ) : (
        <div className="w-full p-5">
                    <Carousel
            items={[...trendingMovies, ...trendingTVs]}
          />
        </div>
      )}

      <div className="flex flex-row">
        <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center">
          <HomeList
            title="Favourites"
            lists={favouritesList.map((list) => ({
              ...list,
              content: list.content.map((item) => ({
                ...item,
                rating: getUserRatingForContent(item.contentId),
                isUserSpecificRating: true,
              })),
            }))}
          />
        </div>
        <div className="mx-5 w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center">
          <HomeList
            title="To Watch"
            lists={toWatchList.map((list) => ({
              ...list,
              content: list.content.map((item) => ({
                ...item,
                rating: getUserRatingForContent(item.contentId),
                isUserSpecificRating: true,
              })),
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
