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
    MovieCollection.find({ contentId: { $in: movieIds } }),
    TVCollection.find({ contentId: { $in: tvIds } })
  ];
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
  const collection = contentType === 'Movie' ? MovieCollection : TVCollection;
  return collection.find({ contentId: contentId });
});

Meteor.publish('searchContent', function(searchParams) {
  const { searchTerm, type, limit, skip } = searchParams;
  if (!this.userId) return this.ready();

  const collection = type === 'Movie' ? MovieCollection : TVCollection;
  const query = searchTerm ? { title: { $regex: searchTerm, $options: 'i' } } : {};

  return collection.find(query, {
    fields: { title: 1, contentId: 1, image_url: 1, popularity: 1 }, // only necessary fields
    limit,
    skip,
    sort: { popularity: -1 }
  });
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