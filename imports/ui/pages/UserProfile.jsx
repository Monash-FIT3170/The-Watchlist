import React, { useState, useEffect, useMemo } from 'react';
import { Meteor } from 'meteor/meteor';
import ContentList from '../components/lists/ContentList';
import ProfileCard from '../components/headers/ProfileCard';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../../db/List';
import { RatingCollection } from '../../db/Rating';
import ListDisplay from '../components/lists/ListDisplay';

export default function UserProfile() {
  // 1. Hook: useTracker for currentUser
  const currentUser = useTracker(() => Meteor.user(), []);

  // 2. Hook: useTracker for lists, subscribedLists, ratings
  const { lists, subscribedLists, ratings, loading } = useTracker(() => {
    const listsHandler = Meteor.subscribe('userLists', Meteor.userId());
    const subscribedHandler = Meteor.subscribe('subscribedLists', Meteor.userId());
    const ratingsHandler = Meteor.subscribe('userRatings', Meteor.userId());

    const lists = ListCollection.find({ userId: Meteor.userId() }).fetch();
    const subscribedLists = ListCollection.find({
      subscribers: { $in: [Meteor.userId()] },
    }).fetch();
    const ratings = RatingCollection.find({ userId: Meteor.userId() }).fetch();

    return {
      lists,
      subscribedLists,
      ratings,
      loading:
        !listsHandler.ready() ||
        !subscribedHandler.ready() ||
        !ratingsHandler.ready(),
    };
  }, []);

  // 3. Hook: useState for isFollowing
  const [isFollowing, setIsFollowing] = useState(false);

  // 4. Hook: useEffect for checking if the current user is following
  useEffect(() => {
    if (currentUser) {
      Meteor.call('isFollowing', currentUser._id, (error, result) => {
        if (!error) {
          setIsFollowing(result);
        }
      });
    }
  }, [currentUser]);

  // 5. Hook: useEffect for updating privacy settings
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

  // **Early Return for Loading State**
  // if (!currentUser || loading) {
  //   return <div>Loading...</div>;
  // }

  // **Compute ratingsCount**
  const ratingsCount = ratings.length;

  // **Memoize userProfile to prevent unnecessary recalculations**
  const userProfile = useMemo(() => ({
    avatarUrl:
      currentUser.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg',
    userName: currentUser.username || 'Default User',
    ratings: ratingsCount, // Use computed ratingsCount
    followers: currentUser.followers?.length || '0',
    following: currentUser.following?.length || '0',
    userRealName: currentUser.realName || 'No Name Provided',
    userDescription: currentUser.description || 'No description provided.',
    _id: currentUser._id,
    userPrivacy: currentUser.profile?.privacy || 'Public',
  }), [currentUser, ratingsCount]);

  // **Find specific lists**
  const userLists = lists || [];
  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');

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
