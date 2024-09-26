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
    Meteor.users.update(targetUserId, { $addToSet: { followers: this.userId }, $set: { followedAt: new Date() } });
    }
  },
  acceptRequest(followerUserID) {
    check(followerUserID, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorised');
    }
    // add the user to the follow list
    Meteor.users.update(followerUserID, { $addToSet: { following: this.userId } });
    Meteor.users.update(this.userId, { $addToSet: { followers: followerUserID } });
    //remove the user from the requests list
    Meteor.users.update(followerUserID, { $pull: { followingRequests: this.userId } });
    Meteor.users.update(this.userId, { $pull: { followerRequests: followerUserID } });
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
      throw new Meteor.Error('not-authorised');
    }
    //remove from request if they are in there
    Meteor.users.update(this.userId, { $pull: { followingRequests: targetUserId } });
    Meteor.users.update(targetUserId, { $pull: { followerRequests: this.userId } });
    //and remove from the following list
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
    } else {
      // For Private setting, just update the privacy setting
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

    console.log('Fetched lists:', { favouritesList, toWatchList });

    const allContent = [];
    if (favouritesList?.content?.length > 0) {
      allContent.push(...favouritesList.content);
    }
    if (toWatchList?.content?.length > 0) {
      allContent.push(...toWatchList.content);
    }

    console.log('All content from lists:', allContent);

    if (allContent.length === 0) {
      console.log('No content in Favourite or To Watch lists.');
      return { movies: [], shows: [] };
    }

    // Select random content from user's lists
    const selectedContent = selectRandomContent(allContent, 5);
    console.log('Selected random content:', selectedContent);

    // Separate titles by content type
    const movieTitles = selectedContent.filter(item => item.contentType === 'Movie').map(item => item.title);
    const tvTitles = selectedContent.filter(item => item.contentType === 'TV Show').map(item => item.title);

    console.log('Movie Titles:', movieTitles);
    console.log('TV Show Titles:', tvTitles);

    const recommendedMovies = movieTitles.length > 0 ? fetchContentRecommendations(movieTitles, 'movies') : [];
    const recommendedShows = tvTitles.length > 0 ? fetchContentRecommendations(tvTitles, 'tv') : [];

    console.log('Recommended Movies:', recommendedMovies);
    console.log('Recommended Shows:', recommendedShows);

    return { movies: recommendedMovies, shows: recommendedShows };
  },
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
    console.log(`Recommendation data for ${title}:`, recommendationData);
    const recommendedIds = recommendationData ? recommendationData[contentType === 'movies' ? 'similar_movies' : 'similar_tvs'] : [];
    const idsToFetch = recommendedIds.slice(0, 35).map(id => Number(id)); // Convert to Number

    console.log(`IDs to fetch for ${title}:`, idsToFetch);

    const contentItems = (contentType === 'movies' ? MovieCollection : TVCollection)
      .find({ contentId: { $in: idsToFetch } })
      .fetch();

    console.log(`Recommendations for ${title}:`, contentItems);

    recommendations.push({
      title,
      recommendations: contentItems,
    });
  });

  return recommendations;
}
