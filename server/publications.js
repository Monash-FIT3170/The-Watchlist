import { Meteor } from 'meteor/meteor';

Meteor.publish('userData', function (userId) {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find(
    { _id: userId },
    {
      fields: {
        username: 1,
        avatarUrl: 1,
        followers: 1,
        following: 1,
        realName: 1,
        description: 1,
      },
    }
  );
});

Meteor.publish('allUsers', function () {
  return Meteor.users.find({}, {
    fields: {
      username: 1,
      followers: 1,
      following: 1,
      avatarUrl: 1,
      realName: 1,
      description: 1,
    },
  });
});

Meteor.publish('userLists', function (userId) {
  return Lists.find({ userId });
});

Meteor.publish('userRatings', function (userId) {
  return Ratings.find({ userId });
});
