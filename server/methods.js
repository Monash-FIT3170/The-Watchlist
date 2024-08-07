import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Rating } from '../imports/db/Rating';
import { RatingCollection } from '../imports/db/Rating';
import Lists from '../imports/db/List';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ListCollection } from '../imports/db/List';

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
    console.log('addOrUpdate method called with:', { userId, contentId, contentType, rating });

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

const createDefaultLists = (userId) => {
  const defaultLists = [
    { title: 'Favourite', listType: 'Favourite' },
    { title: 'To Watch', listType: 'To Watch' },
  ];

  defaultLists.forEach((list) => {
    Meteor.call('list.create', { userId, title: list.title, listType: list.listType, content: [] }, (error) => {
      if (error) {
        console.error('Error creating default list:', error.reason);
      }
    });
  });
};

Accounts.onCreateUser((options, user) => {
  const githubData = user.services && user.services.github;
  const googleData = user.services && user.services.google;
  const defaultAvatarUrl = "https://randomuser.me/api/portraits/lego/1.jpg";

  if (githubData) {
    user.avatarUrl = githubData.avatar;
    user.username = githubData.username;
    user.realName = githubData.name;
    user.description = "";
  } else if (googleData) {
    user.avatarUrl = googleData.picture;
    user.username = googleData.name;
    user.realName = googleData.name;
    user.description = "";
  } else {
    user.avatarUrl = defaultAvatarUrl;
  }
  user.following = [];
  user.followers = [];

  if (options.profile) {
    user.profile = options.profile;
  }

  return user;
});

Accounts.onLogin(() => {
  const userId = Meteor.userId();
  const user = Meteor.user();

  if (user && !user.defaultListsCreated) {
    createDefaultLists(userId);

    // Update user document to indicate that default lists have been created
    Meteor.users.update(userId, {
      $set: {
        defaultListsCreated: true
      }
    });
  }
  FlowRouter.go('/home');
});


Meteor.methods({
  'users.ratingsCount'({ userId }) {
    check(userId, String);
    return RatingCollection.find({ userId }).count();
  },
});

Meteor.methods({
  'list.subscribe'(listId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to subscribe to lists.');
    }

    const list = ListCollection.findOne({ _id: listId });

    if (!list) {
      throw new Meteor.Error('not-found', 'List not found.');
    }

    if (list.userId === this.userId) {
      throw new Meteor.Error('invalid-action', 'You cannot subscribe to your own list.');
    }

    const result = ListCollection.update(
      { _id: listId },
      { $addToSet: { subscribers: this.userId } }
    );

    if (result) {
      return 'Subscribed successfully';
    } else {
      throw new Meteor.Error('failed', 'Failed to subscribe to list.');
    }
  }
});


// Server-side method to fetch subscribed lists
Meteor.methods({
  'list.getSubscribed': function ({ userId }) {
    // Check if the userId is provided
    if (!userId) {
      throw new Meteor.Error('invalid-argument', 'You must provide a user ID.');
    }

    // Check if the user calling the method is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to access subscribed lists.');
    }

    // Check if the user is requesting their own subscribed lists
    if (this.userId !== userId) {
      throw new Meteor.Error('not-authorized', 'You are not authorized to view other users\' subscribed lists.');
    }

    // Fetch and return lists where the specified userId is in the subscribers array
    return Lists.find({
      subscribers: { $in: [userId] }
    }, {
      fields: { title: 1, userName: 1, content: 1 }  // Limit the fields returned for privacy/security
    }).fetch();
  }
});

Meteor.methods({
  'list.unsubscribe'(listId) {
    check(listId, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to unsubscribe from lists.');
    }

    const list = ListCollection.findOne({ _id: listId });

    if (!list) {
      throw new Meteor.Error('not-found', 'List not found.');
    }

    if (list.userId === this.userId) {
      throw new Meteor.Error('invalid-action', 'You cannot unsubscribe from your own list.');
    }

    const result = ListCollection.update(
      { _id: listId },
      { $pull: { subscribers: this.userId } }
    );

    if (result) {
      return 'Unsubscribed successfully';
    } else {
      throw new Meteor.Error('failed', 'Failed to unsubscribe from list.');
    }
  }
});

Meteor.methods({
  'ratings.getAverage'({ contentId, contentType }) {
    check(contentId, Number);
    check(contentType, String);

    // Fetch all ratings for the given content
    const ratings = RatingCollection.find({ contentId, contentType }).fetch();

    if (ratings.length === 0) {
      return 0; // Return 0 if no ratings exist
    }

    // Calculate the average rating
    const totalRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatings / ratings.length;

    return averageRating;
  },
});

Meteor.methods({
  'ratings.getUserRating'({ userId, contentId, contentType }) {
    check(userId, String);
    check(contentId, Number);
    check(contentType, String);

    // Fetch the user's rating for the given content
    const rating = RatingCollection.findOne({ userId, contentId, contentType });

    return rating ? rating.rating : null; // Return null if no rating exists
  },
});

// In methods.js
Meteor.methods({
  'ratings.getGlobalAverages'() {
    const ratings = RatingCollection.find().fetch();
    const ratingMap = ratings.reduce((acc, rating) => {
      if (!acc[rating.contentId]) {
        acc[rating.contentId] = {
          count: 0,
          total: 0
        };
      }
      acc[rating.contentId].count += 1;
      acc[rating.contentId].total += rating.rating;
      return acc;
    }, {});

    for (const id in ratingMap) {
      ratingMap[id].average = (ratingMap[id].total / ratingMap[id].count).toFixed(2);
    }

    return ratingMap;
  }
});
