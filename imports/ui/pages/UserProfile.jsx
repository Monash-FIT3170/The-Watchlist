// imports/ui/pages/UserProfile.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useParams } from 'react-router-dom';
import { ListCollection } from '../../db/List';
import ContentList from '../components/lists/ContentList';
import ProfileCard from '../components/headers/ProfileCard';
import ListDisplay from '../components/lists/ListDisplay';
import { FaLock } from "react-icons/fa";
import { Counts } from 'meteor/tmeasday:publish-counts';

const UserProfile = ({ currentUser, loading }) => {
  const { userId } = useParams(); // Extract userId from route parameters
  const isOwnProfile = !userId || userId === currentUser._id; // Determine if viewing own profile

  const [isFollowing, setIsFollowing] = useState(false);

  // Define the profileUserId based on the context
  const profileUserId = isOwnProfile ? currentUser._id : userId;

  // Subscribe to the profile user's data
  const profileUserHandle = useTracker(() => {
    return Meteor.subscribe('userProfileData', profileUserId);
  }, [profileUserId]);

  // Fetch the profile user's data
  const profileUser = useTracker(() => {
    if (profileUserHandle.ready()) {
      return Meteor.users.findOne({ _id: profileUserId });
    }
    return null;
  }, [profileUserHandle, profileUserId]);

  // Fetch the ratings count specific to the profile user
  const profileRatingsCount = useTracker(() => {
    return Counts.get(`userRatingsCount_${profileUserId}`) || 0;
  }, [profileUserId]);

  // Check if current user is following the profile user (only if not own profile)
  useEffect(() => {
    if (!isOwnProfile && profileUser) {
      Meteor.call('isFollowing', currentUser._id, profileUser._id, (error, result) => {
        if (!error) {
          setIsFollowing(result);
        }
      });
    }
  }, [isOwnProfile, profileUser, currentUser._id]);

  // Handle follow/unfollow actions (only for other users)
  const toggleFollow = () => {
    if (isFollowing) {
      Meteor.call('unfollowUser', currentUser._id, profileUser._id, (error) => {
        if (!error) {
          setIsFollowing(false);
        } else {
          console.error('Error unfollowing user:', error.reason);
        }
      });
    } else {
      Meteor.call('followUser', currentUser._id, profileUser._id, (error) => {
        if (!error) {
          setIsFollowing(true);
        } else {
          console.error('Error following user:', error.reason);
        }
      });
    }
  };

  // Update privacy settings if own profile and privacy is undefined
  useEffect(() => {
    if (isOwnProfile && profileUser && profileUser.profile?.privacy === undefined) {
      Meteor.call('users.updatePrivacy', 'Public', (error) => {
        if (error) {
          console.error('Error updating privacy setting:', error.reason);
        } else {
          console.log('Privacy setting updated to: Public');
        }
      });
    }
  }, [isOwnProfile, profileUser]);

  // Prepare user profile data
  const userProfile = useMemo(() => {
    if (!profileUser) return null;
    return {
      avatarUrl: profileUser.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
      userName: profileUser.username || 'Default User',
      ratings: profileRatingsCount || 0, // Correctly assigned
      followers: profileUser.followers?.length || '0',
      following: profileUser.following?.length || '0',
      userRealName: profileUser.realName || 'No Name Provided',
      userDescription: profileUser.description || 'No description provided.',
      _id: profileUser._id,
      userPrivacy: profileUser.profile?.privacy || 'Public',
    };
  }, [profileUser, profileRatingsCount]);

  // Subscribe to the profile user's lists
  const listsHandle = useTracker(() => {
    return Meteor.subscribe('userLists', profileUserId);
  }, [profileUserId]);

  // Fetch the profile user's lists
  const userLists = useTracker(() => {
    if (listsHandle.ready()) {
      return ListCollection.find({ userId: profileUserId }).fetch();
    }
    return [];
  }, [listsHandle, profileUserId]);

  // Separate owned lists and subscribed lists
  const ownedLists = useMemo(() => (
    userLists.filter(list => list.userId === profileUserId)
  ), [userLists, profileUserId]);

  const subscribedLists = useMemo(() => (
    userLists.filter(list => list.userId !== profileUserId)
  ), [userLists, profileUserId]);

  // Further categorize owned lists by listType
  const favouritesList = useMemo(() => (
    ownedLists.find((list) => list.listType === 'Favourite')
  ), [ownedLists]);

  const toWatchList = useMemo(() => (
    ownedLists.find((list) => list.listType === 'To Watch')
  ), [ownedLists]);

  const customWatchlists = useMemo(() => (
    ownedLists.filter((list) => list.listType === 'Custom')
  ), [ownedLists]);

  // Determine if content can be viewed based on privacy and follow status
  const canViewContent = useMemo(() => {
    if (!userProfile) {
      return false;
    }
    if (isOwnProfile) {
      return true;
    }
    if (userProfile.userPrivacy === 'Public') {
      return true;
    }
    if (userProfile.userPrivacy === 'Private' && isFollowing) {
      return true;
    }
    return false;
  }, [isOwnProfile, userProfile, isFollowing]);

  if (loading || !profileUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <ProfileCard
        currentUser={currentUser}
        user={userProfile}
        showFollowButton={!isOwnProfile}
        isFollowing={isFollowing}
        toggleFollow={toggleFollow}
      />
      <div className="p-6">
        {canViewContent ? (
          <div>
            {favouritesList && (
              <ContentList
                key={favouritesList._id}
                list={{
                  ...favouritesList,
                  content: favouritesList.content.map((item) => ({
                    ...item,
                    isUserSpecificRating: isOwnProfile,
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
                    isUserSpecificRating: isOwnProfile,
                  })),
                }}
              />
            )}
            <ListDisplay listData={customWatchlists} heading="Custom Watchlists" />
            <ListDisplay heading="Subscribed Watchlists" listData={subscribedLists} />
          </div>
        ) : (
          <div className="flex flex-col items-center mt-40 min-h-screen">
            <p className="mb-5 font-bold text-center">This user's profile is private.</p>
            <FaLock size={200} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
