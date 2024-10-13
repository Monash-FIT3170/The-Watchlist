// imports/db/Migrations.js

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Migrations } from './Migrations';

Meteor.startup(() => {
  // Check if the migration has already been run
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
});
