import { Meteor } from 'meteor/meteor';
import { RatingCollection } from '../imports/db/Rating';
import { MovieCollection } from '../imports/db/Content';
import { TVCollection } from '../imports/db/Content';
import { ListCollection } from '../imports/db/List';

Meteor.publish('userData', function (userId) {
  if (!this.userId) {
    return this.ready();
  }

  return Meteor.users.find(
    { _id: userId },
    {
      fields: {
        'profile.privacy': 1,
        username: 1,
        avatarUrl: 1,
        followerRequests: 1,
        followingRequests: 1,
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
      'profile.privacy': 1,
      username: 1,
      followerRequests: 1,
      followingRequests: 1,
      followers: 1,
      following: 1,
      avatarUrl: 1,
      realName: 1,
      description: 1,
    },
  });
});

// Server-side publication for user-created lists
Meteor.publish('userLists', function (userId) {
  if (!this.userId || this.userId !== userId) {
    return this.ready();
  }
  return ListCollection.find({ userId });
});

Meteor.publish('userRatings', function (userId) {
  return RatingCollection.find({ userId });
});

// Server: publications.js
Meteor.publish('subscribedLists', function (viewedUserId) {
  if (!this.userId) {
    return this.ready();
  }

  return ListCollection.find({
    subscribers: { $in: [viewedUserId] } // Ensure that we're looking at lists the viewed user has subscribed to
  }, {
    fields: {
      userId: 1,
      userName: 1,
      title: 1,
      description: 1,
      listType: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
      subscribers: 1  // Ensure to publish the subscribers field
    }
  });
});

Meteor.publish('contentById', function (contentId, contentType) {
  if (!this.userId) {
    return this.ready();
  }
  if (contentType === 'Movie') {
    return MovieCollection.find({ contentId: contentId });
  } else if (contentType === 'TV Show' || contentType === 'Season') {
    return TVCollection.find({ contentId: contentId });
  } else {
    return this.ready();
  }
});


Meteor.publish('seasonRatings', function (contentId, seasonId) {

  return RatingCollection.find({
    contentId,
    seasonId,
    contentType: "Season"
  });
});
Meteor.publish('allLists', function () {
  if (!this.userId) {
    return this.ready();
  }

  // Publish all lists for now; later this will be restricted to only visible lists.
  return ListCollection.find({}, {
    fields: {
      userId: 1,
      userName: 1,
      title: 1,
      description: 1,
      listType: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
      subscribers: 1 // Include subscribers field to later restrict based on visibility.
    }
  });
});
Meteor.publish('userProfileData', function (userId) {
  if (!userId) {
    return this.ready();
  }

  // Consolidate user lists and subscribed lists into a single cursor
  const listCursor = ListCollection.find(
    {
      $or: [
        { userId }, // User's own lists
        { subscribers: { $in: [userId] } }, // Lists the user is subscribed to
      ],
    },
    {
      fields: { listType: 1, content: 1, title: 1 },
    }
  );

  // Publish user data
  const userCursor = Meteor.users.find(
    { _id: userId },
    {
      fields: {
        'profile.privacy': 1,
        username: 1,
        avatarUrl: 1,
        followerRequests: 1,
        followingRequests: 1,
        followers: 1,
        following: 1,
        realName: 1,
        description: 1,
      },
    }
  );

  // Publish ratings count using publish-counts
  Counts.publish(this, 'userRatingsCount', RatingCollection.find({ userId }), { noReady: true });

  return [listCursor, userCursor];
});