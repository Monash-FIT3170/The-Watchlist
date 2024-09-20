// imports/ui/pages/UserProfile.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import ContentList from '../components/lists/ContentList';
import ProfileCard from '../components/headers/ProfileCard';
import { ListCollection } from '../../db/List';
import ListDisplay from '../components/lists/ListDisplay';

export default function UserProfile({ currentUser, ratingsCount, loading }) {
  // Early Return for Loading State
  if (loading || !currentUser) {
    return <div>Loading...</div>;
  }

  // Hook: useState for isFollowing
  const [isFollowing, setIsFollowing] = useState(false);

  // Hook: useEffect for checking if the current user is following
  useEffect(() => {
    if (currentUser) {
      Meteor.call('isFollowing', currentUser._id, (error, result) => {
        if (!error) {
          setIsFollowing(result);
        }
      });
    }
  }, [currentUser]);

  // Hook: useEffect for updating privacy settings
  useEffect(() => {
    if (currentUser && currentUser.profile?.privacy === undefined) {
      Meteor.call('users.updatePrivacy', 'Public', (error) => {
        if (error) {
          console.error('Error updating privacy setting:', error.reason);
        } else {
          console.log('Privacy setting updated to:', 'Public');
        }
      });
    }
  }, [currentUser]);

  // Compute userProfile using useMemo
  const userProfile = useMemo(() => ({
    avatarUrl:
      currentUser.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
    userName: currentUser.username || 'Default User',
    ratings: ratingsCount, // Use ratingsCount from App.jsx
    followers: currentUser.followers?.length || '0',
    following: currentUser.following?.length || '0',
    userRealName: currentUser.realName || 'No Name Provided',
    userDescription: currentUser.description || 'No description provided.',
    _id: currentUser._id,
    userPrivacy: currentUser.profile?.privacy || 'Public',
  }), [currentUser, ratingsCount]);

  // Find all lists (both owned and subscribed)
  const userLists = useMemo(() => (
    ListCollection.find({ userId: currentUser._id }).fetch()
  ), [currentUser._id]);

  // Separate owned lists and subscribed lists
  const ownedLists = useMemo(() => (
    userLists.filter(list => list.userId === currentUser._id)
  ), [userLists, currentUser._id]);

  const subscribedLists = useMemo(() => (
    userLists.filter(list => list.userId !== currentUser._id)
  ), [userLists, currentUser._id]);

  // Further categorize owned lists by listType
  const favouritesList = ownedLists.find((list) => list.listType === 'Favourite');
  const toWatchList = ownedLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = ownedLists.filter((list) => list.listType === 'Custom');

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <ProfileCard
        currentUser={currentUser}
        user={userProfile}
        showFollowButton={false}
      />
      <div className="p-6">
        {favouritesList && (
          <ContentList
            key={favouritesList._id}
            list={{
              ...favouritesList,
              content: favouritesList.content.map((item) => ({
                ...item,
                // Removed individual ratings
                isUserSpecificRating: true,
              })),
            }}
          />
        )}
        {toWatchList && (
          <ContentList
            key={toWatchList._id}
            list={{
              ...toWatchList,
              content: toWatchList.content.map((item) => ({
                ...item,
                // Removed individual ratings
                isUserSpecificRating: true,
              })),
            }}
          />
        )}
        <ListDisplay listData={customWatchlists} heading="Custom Watchlists" />
        <ListDisplay
          heading="Subscribed Watchlists"
          listData={subscribedLists}
        />
      </div>
    </div>
  );
}
