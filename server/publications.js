import { Meteor } from 'meteor/meteor';
import { RatingCollection } from '../imports/db/Rating';
import { MovieCollection } from '../imports/db/Content';
import { TVCollection } from '../imports/db/Content';
import { ListCollection } from '../imports/db/List';
import { check } from "meteor/check";

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
        'following.userId': 1,
        'following.followedAt': 1,
        realName: 1,
        description: 1,
      },
    }
  );
});

Meteor.publish('allUsers', function () {
  return Meteor.users.find(
    {},
    {
      fields: {
        'profile.privacy': 1,
        username: 1,
        followerRequests: 1,
        followingRequests: 1,
        followers: 1,
        'following.userId': 1,
        'following.followedAt': 1,
        avatarUrl: 1,
        realName: 1,
        description: 1,
        createdAt: 1, // Include createdAt field
      },
    }
  );
});

Meteor.publish('userLists', function (profileUserId) {
  // Validate the input
  check(profileUserId, String);

  // If no user is logged in, only publish public lists
  if (!this.userId) {
    const publicLists = ListCollection.find({ userId: profileUserId, visibility: 'PUBLIC' });
    return publicLists;
  }

  // If the viewer is the profile owner, publish all their lists
  if (this.userId === profileUserId) {
    const allLists = ListCollection.find({ userId: profileUserId });
    return allLists;
  }

  // Otherwise, check if the viewer is a follower
  const currentUser = Meteor.users.findOne(this.userId);
  if (!currentUser) {
    return this.ready();
  }

  const isFollower = currentUser.following?.some(follow => follow.userId === profileUserId);

  if (isFollower) {
    const cursor = ListCollection.find({
      userId: profileUserId,
      $or: [
        { visibility: 'PUBLIC' },
        { visibility: 'FOLLOWERS' }
      ]
    });
    return cursor;
  } else {
    const publicLists = ListCollection.find({ userId: profileUserId, visibility: 'PUBLIC' });
    return publicLists;
  }
});

Meteor.publish('ratings', function () {
  return RatingCollection.find({ });
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

// Server-side publication
Meteor.publish('contentByIds', function (contentIds, contentType) {
  if (!this.userId) {
    return this.ready();
  }
  check(contentIds, [Number]);
  check(contentType, String);
  
  const collection = contentType === 'Movie' ? MovieCollection : TVCollection;
  return collection.find({ contentId: { $in: contentIds } });
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

  // Publish all lists for now with restrictions to only Custom lists and lists with public / follower visibility settings
  return ListCollection.find(
    {
      // Following conditions dictate what lists are returned
      visibility: { $in: ["PUBLIC", "FOLLOWERS"] }, 
      listType: { $in: ["Custom"] }
    },
    {
    fields: {
      userId: 1,
      userName: 1,
      title: 1,
      description: 1,
      listType: 1,
      content: 1,
      createdAt: 1,
      updatedAt: 1,
      visibility: 1,
      subscribers: 1 
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
        'following.userId': 1,
        'following.followedAt': 1,
        realName: 1,
        description: 1,
      },
    }
  );

  // Publish ratings count using publish-counts
  Counts.publish(this, `userRatingsCount_${userId}`, RatingCollection.find({ userId }));

  return [listCursor, userCursor];
});