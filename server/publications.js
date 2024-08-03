import { Meteor } from 'meteor/meteor';
import { RatingCollection } from '../imports/db/Rating';
import { MovieCollection } from '../imports/db/Content';
import { TVCollection } from '../imports/db/Content';

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

Meteor.publish('ratedContent', function (userId) {
  console.log("Publishing rated content for user:", userId);
  if (!this.userId) {
    console.log("No user logged in, stopping publication.");
    return this.ready();
  }

  const ratings = RatingCollection.find({ userId }).fetch();
  if (!ratings.length) {
    console.log("No ratings found for this user.");
  } else {
    console.log("Ratings found:", ratings.length);
  }

  const movieIds = ratings.filter(r => r.contentType === 'Movie').map(r => r.contentId);
  const tvIds = ratings.filter(r => r.contentType === 'TV').map(r => r.contentId);

  console.log("Publishing movies and TV data for IDs:", movieIds, tvIds);

  return [
    RatingCollection.find({ userId }),
    MovieCollection.find({ id: { $in: movieIds } }),
    TVCollection.find({ id: { $in: tvIds } })
  ];
});
