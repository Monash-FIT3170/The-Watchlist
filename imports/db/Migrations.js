// imports/db/Migrations.js

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Migrations = new Mongo.Collection('migrations');

export const fixFollowingFollowersStructure = () => {
  const migrationName = 'fix-following-followers-structure';
  const migration = Migrations.findOne({ name: migrationName });
  if (migration && migration.applied) {
    console.log(`Migration '${migrationName}' has already been applied.`);
    return;
  }

  console.log(`Starting migration: ${migrationName}`);

  const usersCursor = Meteor.users.find({}, { fields: { following: 1, followers: 1 } });
  usersCursor.forEach((user) => {
    const { _id, following = [], followers = [] } = user;

    // Process 'following' array
    const newFollowing = following.map((item) => {
      if (typeof item === 'string') {
        // Item is a string (userId)
        return {
          userId: item,
          followedAt: new Date(), // Or set a default date
        };
      } else if (item && typeof item.userId === 'object') {
        // Incorrect nested structure
        return {
          userId: item.userId.userId,
          followedAt: item.userId.followedAt || item.followedAt || new Date(),
        };
      } else if (item && typeof item.userId === 'string') {
        // Correct structure
        return {
          userId: item.userId,
          followedAt: item.followedAt || new Date(),
        };
      } else {
        // Unrecognized format, log and skip
        console.warn(`Unrecognized 'following' item format for user ${_id}:`, item);
        return null;
      }
    }).filter(Boolean); // Remove any null values

    // Process 'followers' array
    const newFollowers = followers.map((item) => {
      if (typeof item === 'string') {
        // Item is a string (userId)
        return {
          userId: item,
          followedAt: new Date(), // Or set a default date
        };
      } else if (item && typeof item.userId === 'object') {
        // Incorrect nested structure
        return {
          userId: item.userId.userId,
          followedAt: item.userId.followedAt || item.followedAt || new Date(),
        };
      } else if (item && typeof item.userId === 'string') {
        // Correct structure
        return {
          userId: item.userId,
          followedAt: item.followedAt || new Date(),
        };
      } else {
        // Unrecognized format, log and skip
        console.warn(`Unrecognized 'followers' item format for user ${_id}:`, item);
        return null;
      }
    }).filter(Boolean); // Remove any null values

    // Update the user document with the new arrays
    Meteor.users.update(
      { _id },
      {
        $set: {
          following: newFollowing,
          followers: newFollowers,
        },
      },
      (error) => {
        if (error) {
          console.error(`Error updating user ${_id}:`, error);
        } else {
          console.log(`Successfully updated user ${_id}`);
        }
      }
    );
  });

  // Mark the migration as applied
  Migrations.upsert(
    { name: migrationName },
    { $set: { applied: true, appliedAt: new Date() } }
  );

  console.log(`Migration '${migrationName}' has been applied.`);
};

export const removeDuplicateFollowingFollowers = () => {
    const migrationName = 'remove-duplicate-following-followers';
    const migration = Migrations.findOne({ name: migrationName });
    if (migration && migration.applied) {
      console.log(`Migration '${migrationName}' has already been applied.`);
      return;
    }
  
    console.log(`Starting migration: ${migrationName}`);
  
    Meteor.users.find({}, { fields: { following: 1, followers: 1 } }).forEach((user) => {
      const { _id, following = [], followers = [] } = user;
  
      // Helper to remove duplicates based on userId
      const removeDuplicates = (array) => {
        const seen = new Set();
        return array.filter(item => {
          const id = typeof item.userId === 'string' ? item.userId : item.userId?.userId;
          if (seen.has(id)) {
            return false;
          }
          seen.add(id);
          return true;
        });
      };
  
      const newFollowing = removeDuplicates(following);
      const newFollowers = removeDuplicates(followers);
  
      // Only update if there are duplicates removed
      const needsUpdate =
        JSON.stringify(following) !== JSON.stringify(newFollowing) ||
        JSON.stringify(followers) !== JSON.stringify(newFollowers);
  
      if (needsUpdate) {
        Meteor.users.update(
          { _id },
          {
            $set: {
              following: newFollowing,
              followers: newFollowers,
            },
          },
          (error) => {
            if (error) {
              console.error(`Error updating user ${_id}:`, error);
            } else {
              console.log(`Successfully updated duplicates for user ${_id}`);
            }
          }
        );
      }
    });
  
    // Mark the migration as applied
    Migrations.upsert(
      { name: migrationName },
      { $set: { applied: true, appliedAt: new Date() } }
    );
  
    console.log(`Migration '${migrationName}' has been applied.`);
  };