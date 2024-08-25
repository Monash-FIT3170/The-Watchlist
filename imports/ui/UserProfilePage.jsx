// imports/ui/UserProfilePage.jsx
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileCard from './ProfileCard';
import ContentList from './ContentList';
import { ListCollection } from '../db/List';
import ListDisplay from './ListDisplay';

const UserProfilePage = () => {
  const { userId } = useParams();
  const [userLists, setUserLists] = useState([]);
  const [globalRatings, setGlobalRatings] = useState({});

  const currentUser = useTracker(() => {
    const handler = Meteor.subscribe('userData', Meteor.userId());
    if (handler.ready()) {
      return Meteor.user();
    }
    return null;
  }, []);

  useEffect(() => {
    // Fetch global ratings using the Meteor method
    Meteor.call('ratings.getGlobalAverages', (error, result) => {
      if (!error) {
        setGlobalRatings(result);
      } else {
        console.error("Error fetching global ratings:", error);
      }
    });
  }, []);

  const { lists, subscribedLists, loading } = useTracker(() => {
    const listsHandler = Meteor.subscribe('userLists', userId); // Subscribe to the lists of the viewed user
    const subscribedHandler = Meteor.subscribe('subscribedLists', userId); // Subscribe to the lists subscribed by the viewed user
    const lists = ListCollection.find({ userId: userId }).fetch(); // Fetch lists of the viewed user
    const subscribedLists = ListCollection.find({
      subscribers: { $in: [userId] } // Fetch lists where the viewed user is a subscriber
    }).fetch();
    return {
      lists,
      subscribedLists,
      loading: !listsHandler.ready() && !subscribedHandler.ready(),
    };
  }, [userId]);

  const isFollowing = (userId) => {
    const currentUser = Meteor.user();
    return currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(userId);
  };

  const handleFollow = (userId) => {
    Meteor.call('followUser', userId, (error, result) => {
      if (error) {
        console.error('Error following user:', error);
      } else {
        console.log('Followed user successfully');
      }
    });
  };

  const handleUnfollow = (userId) => {
    Meteor.call('unfollowUser', userId, (error, result) => {
      if (error) {
        console.error('Error unfollowing user:', error);
      } else {
        console.log('Unfollowed user successfully');
      }
    });
  };

  useEffect(() => {
    if (userId) {
      Meteor.call('list.read', { userId }, (error, result) => {
        if (error) {
          console.error('Error fetching user lists:', error);
        } else {
          setUserLists(result);
        }
      });
    }
  }, [userId]);

  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');

  return (
    <Fragment>
      {currentUser ? (
        <div className="flex flex-col min-h-screen bg-darker">
          <div className="flex flex-col gap-0 flex-grow">
            <ProfileCard
              currentUser={currentUser}
              user={userId}
              showFollowButton={Meteor.userId() !== userId}
            />
            <div className="p-6">
              {Meteor.userId() !== userId && (
                <div className="p-2 mb-4 flex justify-left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFollowing(userId)) {
                        handleUnfollow(userId);
                      } else {
                        handleFollow(userId);
                      }
                    }}
                    className={`mt-2 px-6 py-2 bg-[#7B1450] text-white border-[#7B1450] rounded-full transition-all duration-300 ease-in-out transform hover:scale-110 hover:shadow-lg`}
                  >
                    {isFollowing(userId) ? 'Unfollow' : 'Follow'}
                  </button>

                </div>
              )}
              {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} globalRatings={globalRatings} />}
              {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} globalRatings={globalRatings} />}
              <ListDisplay listData={customWatchlists} heading="Custom Watchlists" />
              <ListDisplay heading="Subscribed Watchlists" listData={subscribedLists} />
            </div>
          </div>
        </div>
      ) : (
        <div>Loading user profile...</div>
      )}
    </Fragment>
  );
};

export default UserProfilePage;
