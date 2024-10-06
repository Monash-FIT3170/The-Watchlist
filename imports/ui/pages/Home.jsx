// src/ui/pages/Home.jsx

import React, { useContext } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import HomeList from '../components/lists/HomeList';
import { RatingCollection } from '../../db/Rating';
import { ListCollection } from '../../db/List';
import { Meteor } from 'meteor/meteor';
import Carousel from '../components/carousel/Carousel';
import { TrendingContext } from '../contexts/TrendingContext';
import LoadingNoAnimation from './LoadingNoAnimation';

const Home = ({ currentUser }) => {
  const { lists, ratings, loading: subscriptionsLoading } = useTracker(() => {
    const userId = Meteor.userId();
    const listsHandle = Meteor.subscribe('userLists', userId);
    const ratingsHandle = Meteor.subscribe('userRatings', userId);

    const lists = ListCollection.find({ userId }).fetch();
    const ratings = RatingCollection.find({ userId }).fetch();
    const loading = !listsHandle.ready() || !ratingsHandle.ready();

    return { lists, ratings, loading };
  }, []);

  const { trendingMovies, trendingTVs, trendingLoading, trendingError } = useContext(TrendingContext);

  const getUserRatingForContent = (contentId) => {
    const rating = ratings.find((r) => r.contentId === contentId);
    return rating ? rating.rating : 0;
  };

  const favouritesList = lists.filter((list) => list.listType === 'Favourite');
  const toWatchList = lists.filter((list) => list.listType === 'To Watch');

  if (trendingLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-darker z-0">
        <div className="absolute top-4 right-6 z-20">
          <ProfileDropdown user={currentUser} />
        </div>

        {/* Carousel of trending content */}
        <LoadingNoAnimation 
                    pageName="The Watchlist" 
                    pageDesc="Looking for content..." 
                    upperScreen={true} 
                />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-darker z-0">
      <div className="absolute top-4 right-6 z-20">
        <ProfileDropdown user={currentUser} />
      </div>

      {/* Carousel of trending content */}
      <div className="w-full p-5">
        <Carousel items={[...trendingMovies, ...trendingTVs]} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row p-0 space-y-5 md:space-y-0 md:space-x-5">
        <div className="flex-1 bg-darker text-light rounded-lg shadow-md p-5">
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
        <div className="flex-1 bg-darker text-light rounded-lg shadow-md p-5">
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
