// imports/ui/UserProfile.jsx
import React, { Fragment, useEffect, useState } from 'react';
import ContentList from './ContentList';
import ProfileCard from './ProfileCard';
import CustomWatchLists from './CustomWatchLists';
import { useLists } from './ListContext';
import { useTracker } from 'meteor/react-meteor-data';

export default function UserProfile() {
  const currentUser = useTracker(() => {
    const handler = Meteor.subscribe('userData', Meteor.userId());
    if (handler.ready()) {
      return Meteor.user();
    }
    return null;
  }, []);

  const { lists, followUser, unfollowUser } = useLists();
  const [isFollowing, setIsFollowing] = useState(false);

  const userLists = currentUser ? lists.filter((list) => list.userId === currentUser._id) : [];
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
          <CustomWatchLists listData={customWatchlists} />
        </div>
      </div>
    );
  };
