import React, { Fragment, useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import ContentList from './ContentList';
import ProfileCard from './ProfileCard';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import ListDisplay from './ListDisplay';

export default function UserProfile() {
  const currentUser = useTracker(() => {
    const handler = Meteor.subscribe('userData', Meteor.userId());
    if (handler.ready()) {
      return Meteor.user();
    }
    return null;
  }, []);

  const { lists, subscribedLists, followUser, unfollowUser } = useTracker(() => {
    const listsHandler = Meteor.subscribe('userLists', Meteor.userId());
    const subscribedHandler = Meteor.subscribe('subscribedLists', Meteor.userId());
    const lists = ListCollection.find({ userId: Meteor.userId() }).fetch();
    const subscribedLists = ListCollection.find({
      subscribers: { $in: [Meteor.userId()] }
    }).fetch();
    return {
      lists,
      subscribedLists,
      loading: !listsHandler.ready() && !subscribedHandler.ready(),
    };
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);

  const userLists = lists || [];
  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');

  useEffect(() => {
    if (currentUser) {
      Meteor.call('isFollowing', currentUser._id, (error, result) => {
        if (!error) {
          setIsFollowing(result);
        }
      });
    }
  }, [currentUser]);

  const handleLogout = () => {
    Meteor.logout((error) => {
      if (error) {
        console.error('Logout failed', error);
      } else {
        console.log('User logged out successfully');
      }
    });
  };

  const userProfile = currentUser
    ? {
      avatarUrl: currentUser.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
      userName: currentUser.username || 'Default User',
      ratings: currentUser.ratings || '0',
      followers: currentUser.followers?.length || '0',
      following: currentUser.following?.length || '0',
      userRealName: currentUser.realName || 'No Name Provided',
      userDescription: currentUser.description || 'No description provided.',
      _id: currentUser._id,
    }
    : {};

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <ProfileCard
        currentUser={currentUser}
        user={userProfile}
        onFollow={null}
        showFollowButton={false}
      />
      <div className="p-6">
        {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} />}
        {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} />}
        <ListDisplay listData={customWatchlists} heading="Custom Watchlists" />
        <ListDisplay heading="Subscribed Watchlists" listData={subscribedLists} />
      </div>
    </div>
  );
}
