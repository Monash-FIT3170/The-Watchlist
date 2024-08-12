// imports/api/userMethods.js
import { Meteor } from 'meteor/meteor';

export const handleFollow = (userId) => {
  Meteor.call('followUser', userId, (error, result) => {
    if (error) {
      console.error('Error following user:', error);
    } else {
      console.log('Followed user successfully');
    }
  });
};

export const handleUnfollow = (userId) => {
  Meteor.call('unfollowUser', userId, (error, result) => {
    if (error) {
      console.error('Error unfollowing user:', error);
    } else {
      console.log('Unfollowed user successfully');
    }
  });
};
