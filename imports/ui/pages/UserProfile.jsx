import React, { useEffect, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import ContentList from '../components/lists/ContentList';
import ProfileCard from '../components/headers/ProfileCard';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../../db/List';
import { RatingCollection } from '../../db/Rating';
import ListDisplay from '../components/lists/ListDisplay';

export default function UserProfile() {
  const currentUser = useTracker(() => {
    const handler = Meteor.subscribe('userData', Meteor.userId());
    if (handler.ready()) {
      return Meteor.user();
    }
    return null;
  }, []);


  useEffect(() => {
    if (currentUser) {      
        //for existing users, if they do not yet have a privacy setting, set it to public
        if (currentUser.profile?.privacy === undefined) {
            Meteor.call('users.updatePrivacy','Public', (error) => {
                if (error) {
                    console.error('Error updating privacy setting:', error.reason);
                } else {
                    console.log('Privacy setting updated to:', 'Public');
                }
            });
        }
    }
}, [currentUser]);

  const { lists, subscribedLists, followUser, unfollowUser, ratings, loading } = useTracker(() => {
    const listsHandler = Meteor.subscribe('userLists', Meteor.userId());
    const subscribedHandler = Meteor.subscribe('subscribedLists', Meteor.userId());
    const ratingsHandler = Meteor.subscribe('userRatings', Meteor.userId());

    const lists = ListCollection.find({ userId: Meteor.userId() }).fetch();
    const subscribedLists = ListCollection.find({
      subscribers: { $in: [Meteor.userId()] }
    }).fetch();
    const ratings = RatingCollection.find({ userId: Meteor.userId() }).fetch();

    return {
      lists,
      subscribedLists,
      ratings,
      loading: !listsHandler.ready() || !subscribedHandler.ready() || !ratingsHandler.ready(),
    };
  }, []);

  const [isFollowing, setIsFollowing] = useState(false);

  const userLists = lists || [];
  const favouritesList = userLists.find((list) => list.listType === 'Favourite');
  const toWatchList = userLists.find((list) => list.listType === 'To Watch');
  const customWatchlists = userLists.filter((list) => list.listType === 'Custom');

  const getUserRatingForContent = (contentId) => {
    const rating = ratings.find(r => r.contentId === contentId);
    return rating ? rating.rating : 0;
  };

  useEffect(() => {
    if (currentUser) {
      Meteor.call('isFollowing', currentUser._id, (error, result) => {
        if (!error) {
          setIsFollowing(result);
        }
      });
    }
  }, [currentUser]);

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
        showFollowButton={false}
      />
      <div className="p-6">
        {favouritesList && (
          <ContentList
            key={favouritesList._id}
            list={{
              ...favouritesList,
              content: favouritesList.content.map(item => ({
                ...item,
                rating: getUserRatingForContent(item.contentId),
                isUserSpecificRating: true
              }))
            }}
          />
        )}
        {toWatchList && (
          <ContentList
            key={toWatchList._id}
            list={{
              ...toWatchList,
              content: toWatchList.content.map(item => ({
                ...item,
                rating: getUserRatingForContent(item.contentId),
                isUserSpecificRating: true
              }))
            }}
          />
        )}
        <ListDisplay listData={customWatchlists} heading="Custom Watchlists" />
        <ListDisplay heading="Subscribed Watchlists" listData={subscribedLists} />
      </div>
    </div>
  );
}
