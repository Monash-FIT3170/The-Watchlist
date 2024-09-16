// imports/ui/UserProfilePage.jsx
import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileCard from '../components/headers/ProfileCard';
import ContentList from '../components/lists/ContentList';
import { ListCollection } from '../../db/List';
import ListDisplay from '../components/lists/ListDisplay';
import { FaLock } from "react-icons/fa";

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



  // Use useTracker to subscribe to userData and fetch user details
  const userProfile = useTracker(() => {
    const handler = Meteor.subscribe('userData', userId);
    if (handler.ready()) {
      const user = Meteor.users.findOne({ _id: userId });
      console.log('Fetched user data:', user);
      if (user) {
        return {
          avatarUrl: user.avatarUrl || './default-avatar.png',
          userName: user.username || 'Unknown User',
          followers: user.followers?.length || '0',
          following: user.following?.length || '0',
          userRealName: user.realName || 'No Name Provided',
          userDescription: user.description || 'No description provided.',
          userPrivacy: user.profile?.privacy,
          _id: userId,
        };
      }
    }
    return null;
  }, [userId]);

  useEffect(() => {
    if (userProfile) {
      console.log('Fetching user lists for userId:', userId);
      Meteor.call('list.read', { userId }, (error, result) => {
        if (error) {
          console.error('Error fetching user lists:', error);
        } else {
          console.log('User lists fetched:', result);
          setUserLists(result);
        }
      });
    }
  }, [userId, userProfile]);

  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');



  return (
    <Fragment>
      {userProfile ? (
        <div className="flex flex-col min-h-screen bg-darker">
          <div className="flex flex-col gap-0 flex-grow">
            <ProfileCard
              currentUser={currentUser}
              user={userProfile}
              showFollowButton={Meteor.userId() !== userId}
            />
            <div className="p-6">
              {/* Conditional rendering based on privacy setting */}
            {userProfile.userPrivacy === 'Private' ? (
              <div className="flex flex-col items-center mt-40 min-h-screen">
              <p className="mb-5 font-bold text-center">This user's profile is private.</p>
              <FaLock size={200} />
            </div>
              ) : (
              <div>
                {/* If the profile is public, display the user lists */}
                {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} globalRatings={globalRatings} />}
                {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} globalRatings={globalRatings} />}
                <ListDisplay listData={customWatchlists} heading="Custom Watchlists" />
                <ListDisplay heading="Subscribed Watchlists" listData={subscribedLists} />
              </div>
            )}
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