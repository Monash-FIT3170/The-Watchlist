// imports/ui/UserProfile.jsx
import React, { Fragment, useEffect, useState } from 'react';
import ContentList from './ContentList';
import ProfileCard from './ProfileCard';
import CustomWatchLists from './CustomWatchLists';
import { useLists } from './ListContext';
import LoginPage from './LoginPage';
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
    <Fragment>
      {currentUser ? (
        <div className="flex flex-col gap-6 bg-darker rounded-lg shadow-lg p-6">
          <ProfileCard
            user={userProfile}
            onFollow={null}
            showFollowButton={false}
          />
          <button onClick={handleLogout} className="self-start px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700">
            Log Out
          </button>
          {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} />}
          {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} />}
          <CustomWatchLists listData={customWatchlists} />
        </div>
      ) : (
        <LoginPage />
      )}
    </Fragment>
  );
}
