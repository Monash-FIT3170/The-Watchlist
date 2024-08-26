import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import HomeList from '../components/lists/HomeList';
import { RatingCollection } from '../../db/Rating';
import { FaUser } from "react-icons/fa";
import { ListCollection } from '../../db/List';

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

  const getUserRatingForContent = (contentId) => {
    const rating = ratings.find(r => r.contentId === contentId);
    return rating ? rating.rating : 0;
  };

  const favouritesList = lists.filter(list => list.listType === 'Favourite');
  const toWatchList = lists.filter(list => list.listType === 'To Watch');

  return (
    <div className="flex flex-row min-h-screen bg-darker">
      <div className="absolute top-4 right-8">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center">
        <HomeList
          title="Favourites"
          lists={favouritesList.map(list => ({
            ...list,
            content: list.content.map(item => ({
              ...item,
              rating: getUserRatingForContent(item.contentId),
              isUserSpecificRating: true
            }))
          }))}
        />
      </div>
      <div className="mx-5 w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center">
        <HomeList
          title="To Watch"
          lists={toWatchList.map(list => ({
            ...list,
            content: list.content.map(item => ({
              ...item,
              rating: getUserRatingForContent(item.contentId),
              isUserSpecificRating: true
            }))
          }))}
        />
      </div>
    </div>
  );
};

export default Home;
