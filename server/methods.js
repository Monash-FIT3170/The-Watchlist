import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Rating } from '../imports/db/Rating';
import { RatingCollection } from '../imports/db/Rating';
import Lists from '../imports/db/List';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ListCollection } from '../imports/db/List';
import { MovieCollection, TVCollection } from '../imports/db/Content';

Meteor.methods({
  followUser(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
    }
    // grab the target user so we can check their privacy settings
    const targetUser = Meteor.users.findOne({ _id: targetUserId }, { fields: { 'profile.privacy': 1, followers: 1, following: 1 } });

    // check if the target user has a private profile, and if so add the current user to their requests
    if (targetUser.profile && targetUser.profile.privacy === 'Private') {
      Meteor.users.update(targetUserId, { $addToSet: { followerRequests: this.userId } });
      Meteor.users.update(this.userId, { $addToSet: { followingRequests: targetUserId } });
    }else{ //else add the current user to the target user's followers and the target user to the current user's following
    Meteor.users.update(this.userId, { $addToSet: { following: targetUserId } });
    Meteor.users.update(targetUserId, { $addToSet: { followers: this.userId } });
    }
  },
  accceptRequest(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
    }
    // add the user to the follow list
    Meteor.users.update(this.userId, { $addToSet: { following: targetUserId } });
    Meteor.users.update(targetUserId, { $addToSet: { followers: this.userId } });
    //remove the user from the requests list
    Meteor.users.update(this.userId, { $pull: { followingRequests: targetUserId } });
    Meteor.users.update(targetUserId, { $pull: { followerRequests: this.userId } });
  },
  unfollowUser(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
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
  'ratings.addOrUpdateSeasonRating'({ userId, contentId, seasonId, rating }) {
    console.log("Received parameters for addOrUpdateSeasonRating", { userId, contentId, seasonId, rating });
    check(userId, String);
    check(contentId, Number);
    check(seasonId, Number);
    check(rating, Number);

    const existingRating = Rating.findOne({ userId, contentId, seasonId });
    if (existingRating) {
      Rating.update({ _id: existingRating._id }, {
        $set: { rating }
      });
    } else {
      Rating.insert({
        userId: userId,
        contentId: contentId,
        seasonId: seasonId,
        contentType: "Season",
        rating: rating
      });
    }
  },
  'ratings.getSeasonAverage'({ contentId, seasonId }) {
    check(contentId, Number);
    check(seasonId, Number);

    // Fetch all ratings for the given content and season
    const seasonRatings = RatingCollection.find({ contentId, seasonId, contentType: "Season" }).fetch();

    const totalRatings = seasonRatings.length;

    if (totalRatings === 0) {
      return { averageRating: 0, totalRatings: 0 }; // Return 0 if no ratings exist
    }

    // Calculate the average rating for the season
    const totalRatingsValue = seasonRatings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRatingsValue / totalRatings;

    return {
      averageRating: averageRating.toFixed(1), // Return average rating to one decimal place
      totalRatings
    };
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

  'users.updateProfile'(username) {
    // Ensure the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update your profile.');
    }

    // Update user profile
    try {
      // Update the user's username
      if (username.username) {
        Accounts.setUsername(this.userId, username.username);
      }
      return 'Profile updated successfully';
    } catch (error) {
      throw new Meteor.Error('update-failed', error.message);
    }
  },

  'users.deleteUser'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to delete your account.');
    }
    // Remove the user from the collection
    Meteor.users.remove(this.userId);
  }
  // add method here

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
  user.followerRequests = [];
  user.followingRequests = [];
  user.followers = [];

  user.profile = {
    ...options.profile,  
    privacy: 'Public'    
  };

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
  'users.updatePrivacy'(privacySetting) {
    check(privacySetting, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorised', 'You must be logged in to update your privacy setting.');
    }

    
    if (!['Public', 'Private'].includes(privacySetting)) {
      throw new Meteor.Error('invalid-argument', 'Invalid privacy setting.');
    }
    if (privacySetting === 'Public') {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.privacy': 'Public',
          followerRequests: [],           // Clear follow requests
          followingRequests: []         // Clear following requests
        }
      });
    } else{

    Meteor.users.update(this.userId, {
      $set: {
        'profile.privacy': privacySetting
      }
    });
  }
  }
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
Meteor.methods({
  'genres.getAll': async function () {
    const movieGenres = await MovieCollection.rawCollection().distinct("genres");
    const tvGenres = await TVCollection.rawCollection().distinct("genres");

    // Combine and deduplicate the genres
    const allGenres = Array.from(new Set([...movieGenres, ...tvGenres]));

    return allGenres;
  }
});
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
Meteor.methods({
  'users.getSimilarUsers'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to find similar users.');
    }

    const currentUser = Meteor.users.findOne(this.userId);
    if (!currentUser) {
      throw new Meteor.Error('user-not-found', 'User not found.');
    }

    const currentUserFavourites = ListCollection.findOne({
      userId: this.userId,
      listType: 'Favourite'
    });

    if (!currentUserFavourites || currentUserFavourites.content.length === 0) {
      throw new Meteor.Error('no-favourites', 'You do not have any favourites.');
    }

    const currentUserFavouritesSet = new Set(currentUserFavourites.content);

    const randomUsers = Meteor.users.rawCollection().aggregate([
      { $sample: { size: 100 } }
    ]).toArray();

    const randomUsersPromise = Meteor.wrapAsync((cb) => randomUsers.then((res) => cb(null, res)).catch(cb));

    const users = randomUsersPromise();

    const userScores = users.map(user => {
      if (user._id === this.userId) {
        return null;
      }

      const userFavourites = ListCollection.findOne({
        userId: user._id,
        listType: 'Favourite'
      });

      if (!userFavourites || !userFavourites.content) {
        return null;
      }

      const userFavouritesSet = new Set(userFavourites.content);

      const userFavouritesArray = Array.from(userFavouritesSet);
      const currentUserFavouritesArray = Array.from(currentUserFavouritesSet);

      const commonFavourites = userFavouritesArray.filter(favourite =>
        currentUserFavouritesArray.some(currentFavourite => currentFavourite.contentId === favourite.contentId)
      );

      if (commonFavourites.size === 0) {
        return null;
      }

      const avgListLength = (userFavouritesArray.length + currentUserFavouritesArray.length) / 2;

      matchScore = commonFavourites.length / avgListLength * 100 * 1.5;

      if (matchScore > 100) {
        matchScore = 100;
      }

      return {
        user: user,
        matchScore: matchScore
      };
    });

    // Filter out null values and sort by matchScore in descending order
    const sortedUserScores = userScores.filter(Boolean).sort((a, b) => b.matchScore - a.matchScore);

    // set top user as 100 match, etc
    sortedUserScores.forEach((user, index) => {
      user.matchScore = Math.floor(user.matchScore);
    });

    // Return the top 10 users with the highest match score
    return sortedUserScores.slice(0, 10);
  }
});
Meteor.methods({
  'list.getById': function (listId) {
    console.log(`list.getById method called with listId: ${listId}`); // Log method call

    check(listId, String);

    if (!this.userId) {
      console.log('User not authorized to view lists'); // Log unauthorized access
      throw new Meteor.Error('not-authorized', 'You must be logged in to view lists.');
    }

    const list = ListCollection.findOne({ _id: listId });

    if (!list) {
      console.log(`List not found for listId: ${listId}`); // Log if list is not found
      throw new Meteor.Error('not-found', 'List not found.');
    }

    // Fetch content details including popularity
    const contentWithPopularity = list.content.map(item => {
      let contentItem;
      if (item.contentType === 'Movie') {
        contentItem = MovieCollection.findOne({ contentId: item.contentId }, { fields: { popularity: 1 } });
      } else if (item.contentType === 'TV Show') {
        contentItem = TVCollection.findOne({ contentId: item.contentId }, { fields: { popularity: 1 } });
      }
      return {
        ...item,
        popularity: contentItem ? contentItem.popularity : null
      };
    });

    return {
      ...list,
      content: contentWithPopularity
    };
  },
});

