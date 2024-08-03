import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Rating } from '../imports/db/Rating';
import Lists from '../imports/db/List';

Meteor.methods({
  followUser(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Meteor.users.update(this.userId, { $addToSet: { following: targetUserId } });
    Meteor.users.update(targetUserId, { $addToSet: { followers: this.userId } });
  },
  unfollowUser(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Meteor.users.update(this.userId, { $pull: { following: targetUserId } });
    Meteor.users.update(targetUserId, { $pull: { followers: this.userId } });
  },
  isFollowing(targetUserId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const user = Meteor.users.findOne(this.userId);
    return user.following.includes(targetUserId);
  },
  'users.followers'({ userId }) {
    check(userId, String);
    const user = Meteor.users.findOne(userId);
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    return Meteor.users.find({ _id: { $in: user.followers } }, { fields: { username: 1, avatarUrl: 1 } }).fetch();
  },
  'users.following'({ userId }) {
    check(userId, String);
    const user = Meteor.users.findOne(userId);
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    return Meteor.users.find({ _id: { $in: user.following } }, { fields: { username: 1, avatarUrl: 1 } }).fetch();
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
  updateAvatar(userId, avatarUrl) {
    check(userId, String);
    check(avatarUrl, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (this.userId !== userId) {
      throw new Meteor.Error('not-authorized', 'You can only update your own avatar');
    }

    Meteor.users.update(userId, {
      $set: { avatarUrl: avatarUrl }
    });
  },
});

Accounts.onCreateUser((options, user) => {
  const defaultAvatarUrl = "https://randomuser.me/api/portraits/lego/1.jpg";
  user.following = [];
  user.followers = [];
  user.avatarUrl = defaultAvatarUrl;
  if (options.profile) {
    user.profile = options.profile;
  }
  return user;
});
