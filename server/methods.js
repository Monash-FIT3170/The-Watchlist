import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { Rating } from '../imports/db/Rating';
import { RatingCollection } from '../imports/db/Rating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ListCollection } from '../imports/db/List';
import { MovieCollection, TVCollection } from '../imports/db/Content';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';

Meteor.methods({
  followUser(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
    }

    const followedAt = new Date();

    // Fetch target user's privacy settings
    const targetUser = Meteor.users.findOne(
      { _id: targetUserId },
      { fields: { 'profile.privacy': 1 } }
    );

    if (targetUser.profile && targetUser.profile.privacy === 'Private') {
      Meteor.users.update(targetUserId, {
        $addToSet: { followerRequests: this.userId },
      });
      Meteor.users.update(this.userId, {
        $addToSet: { followingRequests: targetUserId },
      });
    } else {
      // Add to following/followers with followedAt
      Meteor.users.update(this.userId, {
        $addToSet: { following: { userId: targetUserId, followedAt } },
      });
      Meteor.users.update(targetUserId, {
        $addToSet: { followers: { userId: this.userId, followedAt } },
      });
    }
  },
  acceptRequest(followerUserID) {
    check(followerUserID, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const followedAt = new Date();

    // Add to following/followers with followedAt
    Meteor.users.update(followerUserID, {
      $addToSet: { following: { userId: this.userId, followedAt } },
    });
    Meteor.users.update(this.userId, {
      $addToSet: { followers: { userId: followerUserID, followedAt } },
    });

    // Remove from requests
    Meteor.users.update(followerUserID, {
      $pull: { followingRequests: this.userId },
    });
    Meteor.users.update(this.userId, {
      $pull: { followerRequests: followerUserID },
    });
  },
  declineRequest(followerUserID) {
    check(followerUserID, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
    }
    //remove the user from the requests list
    Meteor.users.update(followerUserID, { $pull: { followingRequests: this.userId } });
    Meteor.users.update(this.userId, { $pull: { followerRequests: followerUserID } });
  },
  unfollowUser(targetUserId) {
    check(targetUserId, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Remove from requests if present
    Meteor.users.update(this.userId, {
      $pull: { followingRequests: targetUserId },
    });
    Meteor.users.update(targetUserId, {
      $pull: { followerRequests: this.userId },
    });

    // Remove from following/followers
    Meteor.users.update(this.userId, {
      $pull: { following: { userId: targetUserId } },
    });
    Meteor.users.update(targetUserId, {
      $pull: { followers: { userId: this.userId } },
    });
  },
  isFollowing(targetUserId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const user = Meteor.users.findOne(this.userId);
    return (
      user.following &&
      user.following.some((f) => f.userId === targetUserId)
    );
  },
  'users.followers'({ userId }) {
    check(userId, String);
    const user = Meteor.users.findOne(userId);
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    const followerUserIds = user.followers.map((f) => f.userId);
    return Meteor.users
      .find({ _id: { $in: followerUserIds } }, { fields: { username: 1, avatarUrl: 1 } })
      .fetch();
  },
  'users.following'({ userId }) {
    check(userId, String);
    const user = Meteor.users.findOne(userId);
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    const followingUserIds = user.following.map((f) => f.userId);
    return Meteor.users
      .find({ _id: { $in: followingUserIds } }, { fields: { username: 1, avatarUrl: 1 } })
      .fetch();
  },

  'users.followerRequests'({ userId }) {
    check(userId, String);
    const user = Meteor.users.findOne(userId);
    if (!user) {
      throw new Meteor.Error('not-found', 'User not found');
    }
    return Meteor.users.find({ _id: { $in: user.followerRequests } }, { fields: { username: 1, avatarUrl: 1 } }).fetch();
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
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update your profile.');
    }

    check(username, {
      username: String,
    });

    try {
      if (username.username) {
        Accounts.setUsername(this.userId, username.username);

        const updateResult = ListCollection.update(
          { userId: this.userId },
          { $set: { userName: username.username } },
          { multi: true }
        );

        if (updateResult === 0) {
          console.warn('No lists were updated for user:', this.userId);
        }
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

    const userId = this.userId;

    // Remove the user from other users' following and followers lists
    Meteor.users.update(
      { following: userId },
      { $pull: { following: userId } },
      { multi: true }
    );

    Meteor.users.update(
      { followers: userId },
      { $pull: { followers: userId } },
      { multi: true }
    );

    // Remove the user from other users' followerRequests  and followingRequests lists
    Meteor.users.update(
      { followingRequests: userId },
      { $pull: { followingRequests: userId } },
      { multi: true }
    );

    Meteor.users.update(
      { followerRequests: userId },
      { $pull: { followerRequests: userId } },
      { multi: true }
    );

    // Remove user's ratings
    RatingCollection.remove({ userId });

    // Remove user's lists
    ListCollection.remove({ userId });

    // Finally, remove the user
    Meteor.users.remove(userId);
  },
  updateList(userId, avatarUrl, listName) {
    check(userId, String);
    check(avatarUrl, String);
    check(listName, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (this.userId !== userId) {
      throw new Meteor.Error('not-authorized', 'You can only update your own avatar');
    }

    const result = ListCollection.update(
      { userId: this.userId, title: listName },
      { $set: { listUrl: avatarUrl } }
    );

    console.log(`Updated avatar URL for list "${listName}" of user "${userId}"`); // Debug: Log update
  }

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
  'users.updatePrivacy'(privacySetting) {
    check(privacySetting, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorised', 'You must be logged in to update your privacy setting.');
    }

    if (!['Public', 'Private'].includes(privacySetting)) {
      throw new Meteor.Error('invalid-argument', 'Invalid privacy setting.');
    }

    const currentUser = Meteor.users.findOne(this.userId);

    // Ensure followerRequests exists or treat it as an empty array
    const followerRequests = currentUser?.followerRequests || [];


    if (!currentUser.followingRequests) {
      Meteor.users.update(this.userId, { $set: { followingRequests: [] } });
    }

    if (privacySetting === 'Public') {
      if (followerRequests.length > 0) {
        // Add all users from followerRequests to followers
        Meteor.users.update(this.userId, {
          $addToSet: { followers: { $each: followerRequests } },
          $set: {
            'profile.privacy': 'Public',
            followerRequests: [] // Clear follower requests since they are accepted
          }
        });

        // Update the followers for each user in followerRequests
        followerRequests.forEach(followerId => {
          Meteor.users.update(followerId, {
            $addToSet: { following: this.userId }
          });
        });
      } else {
        // If no follower requests, just update the privacy setting
        Meteor.users.update(this.userId, {
          $set: {
            'profile.privacy': 'Public',
            followerRequests: [] // Clear follower requests
          }
        });
      }

      // if list visibility interaction is wanted when changed to 'public' profile, add here.

    } else {
      // For Private setting, just update the privacy setting
      Meteor.users.update(this.userId, {
        $set: {
          'profile.privacy': privacySetting
        }
      });

      // set all PUBLIC list visibilities to FOLLOWERS when profile changed to private
      ListCollection.update(
        {
          userId: this.userId,
          visibility: "PUBLIC"
        },
        {
          $set: {
            visibility: "FOLLOWERS"
          }
        },
        {
          upsert: false,
          multi: true
        }
      );
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
  'list.setVisibility'({ listId, visibleType }) {
    check(listId, String);
    check(visibleType, String);


    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to set list visibility.');
    }

    const list = ListCollection.findOne({ _id: listId });

    if (!list) {
      throw new Meteor.Error('not-found', 'List not found.');
    }

    if (list.userId !== this.userId) {
      throw new Meteor.Error('invalid-action', "You cannot change visibility settings of other user's lists.");
    }

    const result = ListCollection.update(
      { _id: listId },
      { $set: { visibility: visibleType } }
    );

    if (result) {
      return `Successfully changed list visibility to ${visibleType}`;
    } else {
      throw new Meteor.Error('failed', 'Failed to change visibility of list.');
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
  async 'users.getSimilarUsers'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorised', 'You must be logged in to find similar users.');
    }

    const currentUser = Meteor.users.findOne(
      { _id: this.userId },
      { fields: { _id: 1 } }
    );


    if (!currentUser) {
      throw new Meteor.Error('user-not-found', 'User not found.');
    }

    const currentUserFavourites = ListCollection.findOne({
      userId: this.userId,
      listType: 'Favourite'
    });

    if (!currentUserFavourites || currentUserFavourites.content.length === 0 || !currentUserFavourites.content) {
      throw new Meteor.Error('no-favourites', 'You do not have any favourites.');
    }

    const currentUserFavouritesSet = new Set(
      currentUserFavourites.content.map(item => item.contentId)
    );

    const randomUsersCursor = Meteor.users.rawCollection().aggregate([
      { $match: { _id: { $ne: this.userId } } },
      { $sample: { size: 50 } },
      { $project: { _id: 1, avatarUrl: 1, username: 1 } }
    ]);

    const randomUsers = await randomUsersCursor.toArray();

    const userIds = randomUsers.map(user => user._id);

    const allUserFavourites = ListCollection.find({
      userId: { $in: userIds },
      listType: 'Favourite'
    }).fetch();

    const userFavouritesMap = {};
    allUserFavourites.forEach(fav => {
      userFavouritesMap[fav.userId] = fav.content.map(item => item.contentId);
    });

    const userScores = randomUsers
      .map(user => {
        const userFavouritesArray = userFavouritesMap[user._id];
        if (!userFavouritesArray || userFavouritesArray.length === 0) return null;

        const userFavouritesSet = new Set(userFavouritesArray);


        const commonFavourites = [...currentUserFavouritesSet].filter(contentId =>
          userFavouritesSet.has(contentId)
        );

        if (commonFavourites.size === 0) {
          return null;
        }

        const avgListLength = (currentUserFavouritesSet.size + userFavouritesSet.size) / 2;

        let matchScore = Math.round(commonFavourites.length / avgListLength * 100 * 1.5);

        if (matchScore > 100) {
          matchScore = 100;
        }

        return {
          user: {
            _id: user._id,
            avatarUrl: user.avatarUrl,
            username: user.username
          },
          matchScore: matchScore
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        return a.user.username.localeCompare(b.user.username);
      }).slice(0, 10);;

    return userScores;
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

let similarMovies = null;
let similarTVs = null;

// Load and cache similar movies data
function loadSimilarMovies() {
  if (!similarMovies) {
    try {
      const data = Assets.getText('ml_matrices/similar_movies_titles.json');
      similarMovies = JSON.parse(data);
      console.log('Loaded similar_movies_titles.json');
    } catch (error) {
      console.error('Error loading similar_movies_titles.json:', error);
      similarMovies = [];
    }
  }
}

// Load and cache similar TV shows data
function loadSimilarTVs() {
  if (!similarTVs) {
    try {
      const data = Assets.getText('ml_matrices/similar_tvs_title.json');
      similarTVs = JSON.parse(data);
      console.log('Loaded similar_tvs_title.json');
    } catch (error) {
      console.error('Error loading similar_tvs_title.json:', error);
      similarTVs = [];
    }
  }
}

Meteor.methods({
  'getRecommendations'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    console.log('getRecommendations called for user:', this.userId);

    loadSimilarMovies();
    loadSimilarTVs();

    const userId = this.userId;

    // Fetch user's Favourite and To Watch lists
    const favouritesList = ListCollection.findOne({ userId, listType: 'Favourite' });
    const toWatchList = ListCollection.findOne({ userId, listType: 'To Watch' });

    const allContent = [];
    if (favouritesList?.content?.length > 0) {
      allContent.push(...favouritesList.content);
    }
    if (toWatchList?.content?.length > 0) {
      allContent.push(...toWatchList.content);
    }

    if (allContent.length === 0) {
      console.log('No content in Favourite or To Watch lists.');
      return { movies: [], shows: [] };
    }

    // Select random content from user's lists
    const selectedContent = selectRandomContent(allContent, 5);

    // Separate titles by content type
    const movieTitles = selectedContent.filter(item => item.contentType === 'Movie').map(item => item.title);
    const tvTitles = selectedContent.filter(item => item.contentType === 'TV Show').map(item => item.title);

    const recommendedMovies = movieTitles.length > 0 ? fetchContentRecommendations(movieTitles, 'movies') : [];
    const recommendedShows = tvTitles.length > 0 ? fetchContentRecommendations(tvTitles, 'tv') : [];

    return { movies: recommendedMovies, shows: recommendedShows };
  },
});

Meteor.methods({
  async 'ratings.getTopRated'(contentType) {

    if (!["Movie", "TV Show"].includes(contentType)) {
      throw new Meteor.Error('invalid-content-type', 'Content type must be either "Movie" or "TV Show"');
    }

    const pipeline = [

      {
        $match: {
          contentType: contentType
        }
      },

      {
        $group: {
          _id: "$contentId",
          averageRating: { $avg: "$rating" },
          count: { $sum: 1 }
        }
      },


      { $limit: 50 },

      {
        $lookup: {
          from: contentType === 'Movie' ? 'movie' : 'tv',
          localField: "_id",
          foreignField: "contentId",
          as: "contentDetails"
        }
      },

      { $unwind: '$contentDetails' },

      { $sort: { averageRating: -1, 'contentDetails.popularity': 1 } },

      {
        $project: {
          averageRating: 1,
          count: 1,
          contentDetails: 1
        }
      }
    ];

    const rawCollection = RatingCollection.rawCollection();

    try {

      const aggregateResult = await rawCollection.aggregate(pipeline).toArray();

      return aggregateResult;
    } catch (error) {
      console.error('Error fetching top rated content:', error);
      throw new Meteor.Error('fetch-failed', 'Failed to fetch top rated content');
    }
  }
});

// Helper function to select random content
function selectRandomContent(contentList, maxItems) {
  const selectedItems = [];
  const listCopy = [...contentList];

  while (selectedItems.length < maxItems && listCopy.length > 0) {
    const randomIndex = Math.floor(Math.random() * listCopy.length);
    selectedItems.push(listCopy.splice(randomIndex, 1)[0]);
  }
  return selectedItems;
}

// Helper function to fetch content recommendations
function fetchContentRecommendations(titles, contentType) {
  const recommendations = [];
  const similarData = contentType === 'movies' ? similarMovies : similarTVs;

  titles.forEach(title => {
    const recommendationData = similarData.find(rec => rec.Title === title);
    const recommendedIds = recommendationData ? recommendationData[contentType === 'movies' ? 'similar_movies' : 'similar_tvs'] : [];
    const idsToFetch = recommendedIds.slice(0, 35).map(id => Number(id)); // Convert to Number

    const contentItems = (contentType === 'movies' ? MovieCollection : TVCollection)
      .find({ contentId: { $in: idsToFetch } })
      .fetch();

    recommendations.push({
      title,
      recommendations: contentItems,
    });
  });

  return recommendations;
}

let genreMappings = { movies: {}, tv: {} };

function loadGenreMappings(apiKey) {
  const movieGenresUrl = `https://api.themoviedb.org/3/genre/movie/list?language=en-US`;
  const tvGenresUrl = `https://api.themoviedb.org/3/genre/tv/list?language=en-US`;

  try {
    // Fetch movie genres
    const movieGenresResponse = HTTP.get(movieGenresUrl, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    const movieGenres = JSON.parse(movieGenresResponse.content).genres;

    // Fetch TV genres
    const tvGenresResponse = HTTP.get(tvGenresUrl, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    const tvGenres = JSON.parse(tvGenresResponse.content).genres;

    // Reset the genre mappings
    genreMappings.movies = {};
    genreMappings.tv = {};

    // Map movie genres
    movieGenres.forEach(genre => {
      genreMappings.movies[genre.id] = genre.name;
    });

    // Map TV genres
    tvGenres.forEach(genre => {
      genreMappings.tv[genre.id] = genre.name;
    });

  } catch (error) {
    console.error('Error loading genre mappings:', error);
  }
}

// Call this function when the server starts
Meteor.startup(() => {
  const apiKey = Meteor.settings.TMDB_API_KEY;
  if (apiKey) {
    loadGenreMappings(apiKey);
  }
});


function processTMDbData(items, contentType) {

  const genreMap = contentType === 'Movie' ? genreMappings.movies : genreMappings.tv;

  return items.map(item => ({
    contentId: item.id,
    title: item.title || item.name,
    popularity: item.popularity,
    release_year: (item.release_date || item.first_air_date || '').split('-')[0],
    overview: item.overview,
    language: item.original_language,
    genres: item.genre_ids.map(id => genreMap[id]).filter(Boolean),
    image_url: item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : null,
    background_url: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
    contentType,
    rating: 0 // Placeholder; we can fetch average ratings if needed
  }));
}


// methods.js

// Cache object for trending content
let trendingCache = {
  movies: [],
  shows: [],
  timestamp: 0
};

// Cache duration in milliseconds (1 hour)
const TRENDING_CACHE_DURATION = 1 * 60 * 60 * 1000; // 1 hour

Meteor.methods({
  'getTrendingContent'() {
    const now = Date.now();
    if (now - trendingCache.timestamp < TRENDING_CACHE_DURATION) {
      // Return cached data
      return { movies: trendingCache.movies, shows: trendingCache.shows };
    }

    const apiKey = Meteor.settings.TMDB_API_KEY;

    if (!apiKey) {
      throw new Meteor.Error('tmdb-api-key-not-set', 'TMDb API key is not set in Meteor settings.');
    }

    // Define TMDb API endpoints
    const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/week`;
    const trendingTVsUrl = `https://api.themoviedb.org/3/trending/tv/week`;

    try {
      // Fetch trending movies
      const moviesResponse = HTTP.get(trendingMoviesUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      const moviesData = JSON.parse(moviesResponse.content).results;

      // Fetch trending TV shows
      const tvsResponse = HTTP.get(trendingTVsUrl, {
        headers: {
          "Authorization": `Bearer ${apiKey}`
        }
      });
      const tvsData = JSON.parse(tvsResponse.content).results;

      // Process the data
      const movies = processTMDbData(moviesData, 'Movie');
      const shows = processTMDbData(tvsData, 'TV Show');

      // Update the cache
      trendingCache.movies = movies;
      trendingCache.shows = shows;
      trendingCache.timestamp = now;

      return { movies, shows };
    } catch (error) {
      console.error('Error fetching trending content from TMDb:', error);
      throw new Meteor.Error('tmdb-api-error', 'Failed to fetch trending content from TMDb.');
    }
  }
});

Meteor.methods({
  'getRecommendationsByFavoriteGenres'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    const apiKey = Meteor.settings.TMDB_API_KEY;
    if (!apiKey) {
      throw new Meteor.Error('tmdb-api-key-not-set', 'TMDb API key is not set in Meteor settings.');
    }

    // Fetch user's ratings and lists
    const userRatings = RatingCollection.find({ userId: this.userId }).fetch();
    const userLists = ListCollection.find({ userId: this.userId }).fetch();

    // Collect content IDs from ratings and lists
    const ratedContentIds = userRatings.map(r => ({ contentId: r.contentId, contentType: r.contentType }));
    const listContentIds = [];
    userLists.forEach(list => {
      if (list.content) {
        list.content.forEach(item => {
          listContentIds.push({ contentId: item.contentId, contentType: item.contentType });
        });
      }
    });

    // Combine and deduplicate content IDs
    const allUserContent = [...ratedContentIds, ...listContentIds];
    const uniqueUserContent = _.uniq(allUserContent, item => `${item.contentId}-${item.contentType}`);

    // Fetch content documents
    const userContentDocs = [];
    uniqueUserContent.forEach(item => {
      const collection = item.contentType === 'Movie' ? MovieCollection : TVCollection;
      const contentDoc = collection.findOne({ contentId: item.contentId });
      if (contentDoc) {
        userContentDocs.push(contentDoc);
      }
    });

    // Tally genres
    const genreCounts = {};
    userContentDocs.forEach(content => {
      if (content.genres && content.genres.length > 0) {
        content.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Get top N favorite genres
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)  // Top 3 genres
      .map(entry => entry[0]);

    // Map genre names back to TMDb genre IDs
    const movieGenreIds = [];
    const tvGenreIds = [];
    for (const genreName of topGenres) {
      for (const [id, name] of Object.entries(genreMappings.movies)) {
        if (name === genreName) {
          movieGenreIds.push(id);
        }
      }
      for (const [id, name] of Object.entries(genreMappings.tv)) {
        if (name === genreName) {
          tvGenreIds.push(id);
        }
      }
    }

    // Fetch recommendations from TMDb based on genres
    const recommendedMovies = fetchTMDbContentByGenres(apiKey, movieGenreIds, 'movie');
    const recommendedShows = fetchTMDbContentByGenres(apiKey, tvGenreIds, 'tv');

    return { movies: recommendedMovies, shows: recommendedShows, genres: topGenres };
  }
});

// Helper function to fetch content by genres from TMDb
function fetchTMDbContentByGenres(apiKey, genreIds, type) {
  const genreIdsParam = genreIds.join(',');
  const url = `https://api.themoviedb.org/3/discover/${type}?with_genres=${genreIdsParam}&sort_by=popularity.desc`;

  try {
    const response = HTTP.get(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    const data = JSON.parse(response.content).results;
    return processTMDbData(data, type === 'movie' ? 'Movie' : 'TV Show');
  } catch (error) {
    console.error(`Error fetching ${type} content by genres from TMDb:`, error);
    return [];
  }
}

Meteor.methods({
  'getUserGenreStatistics'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Fetch user's ratings and lists
    const userRatings = RatingCollection.find({ userId: this.userId }).fetch();
    const userLists = ListCollection.find({ userId: this.userId }).fetch();

    // Collect content IDs from ratings and lists
    const ratedContentIds = userRatings.map(r => ({ contentId: r.contentId, contentType: r.contentType }));
    const listContentIds = [];
    userLists.forEach(list => {
      if (list.content) {
        list.content.forEach(item => {
          listContentIds.push({ contentId: item.contentId, contentType: item.contentType });
        });
      }
    });

    // Combine and deduplicate content IDs
    const allUserContent = [...ratedContentIds, ...listContentIds];
    const uniqueUserContentMap = new Map();
    allUserContent.forEach(item => {
      const key = `${item.contentId}-${item.contentType}`;
      uniqueUserContentMap.set(key, item);
    });
    const uniqueUserContent = Array.from(uniqueUserContentMap.values());

    // Fetch content documents
    const userContentDocs = [];
    uniqueUserContent.forEach(item => {
      const collection = item.contentType === 'Movie' ? MovieCollection : TVCollection;
      const contentDoc = collection.findOne({ contentId: item.contentId });
      if (contentDoc) {
        userContentDocs.push(contentDoc);
      }
    });

    // Tally genres
    const genreCounts = {};
    userContentDocs.forEach(content => {
      if (content.genres && content.genres.length > 0) {
        content.genres.forEach(genre => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      }
    });

    // Convert to array and sort by count
    const genreStatistics = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    return genreStatistics;
  }
});

Meteor.methods({
  'getRecommendationsByGenre'(genreName) {
    check(genreName, String);

    const apiKey = Meteor.settings.TMDB_API_KEY;
    if (!apiKey) {
      throw new Meteor.Error('tmdb-api-key-not-set', 'TMDb API key is not set in Meteor settings.');
    }

    // Map genre name to TMDb genre IDs
    const movieGenreIds = [];
    const tvGenreIds = [];
    for (const [id, name] of Object.entries(genreMappings.movies)) {
      if (name === genreName) {
        movieGenreIds.push(id);
      }
    }
    for (const [id, name] of Object.entries(genreMappings.tv)) {
      if (name === genreName) {
        tvGenreIds.push(id);
      }
    }

    // Fetch recommendations from TMDb based on the genre
    const recommendedMovies = fetchTMDbContentByGenres(apiKey, movieGenreIds, 'movie');
    const recommendedShows = fetchTMDbContentByGenres(apiKey, tvGenreIds, 'tv');

    return { movies: recommendedMovies, shows: recommendedShows };
  }
});