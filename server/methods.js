// server/methods.js
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Rating } from '../imports/db/Rating';
import Lists from '../imports/db/List';

Meteor.methods({
  followUser(targetUserId) {
      if (!this.userId) {
          throw new Meteor.Error('not-authorized');
      }
      Meteor.users.update(this.userId, {$addToSet: {following: targetUserId}});
      Meteor.users.update(targetUserId, {$addToSet: {followers: this.userId}});
  },
  unfollowUser(targetUserId) {
      if (!this.userId) {
          throw new Meteor.Error('not-authorized');
      }
      Meteor.users.update(this.userId, {$pull: {following: targetUserId}});
      Meteor.users.update(targetUserId, {$pull: {followers: this.userId}});
  },
  isFollowing(targetUserId) {
      if (!this.userId) {
          throw new Meteor.Error('not-authorized');
      }
      const user = Meteor.users.findOne(this.userId);
      return user.following.includes(targetUserId);
  },
  'ratings.addOrUpdate'({ userId, contentId, contentType, rating }) {
      check(userId, String);
      check(contentId, Number);
      check(contentType, String);
      check(rating, Number);

      if (!this.userId) {
          throw new Meteor.Error('not-authorized');
      }

      const existingRating = Rating.findOne({ userId, contentId, contentType });
      if (existingRating) {
          Rating.update({ _id: existingRating._id }, {
              $set: { rating }
          });
      } else {
          Rating.insert({
              userId: this.userId,
              contentId,
              contentType,
              rating
          });
      }
  },
});

Accounts.onCreateUser((options, user) => {
    const defaultAvatarUrl = "./ExampleResources/user-avatar.jpg"; 
    user.following = [];
    user.followers = [];
    user.avatarUrl = defaultAvatarUrl;
    if (options.profile) {
        user.profile = options.profile;
    }
    return user;
});
