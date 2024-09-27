// server/main.js
import { Meteor } from 'meteor/meteor';

// This import is required to register the Methods and Publishers.
import ContentHandler from '../imports/api/server/ContentHandler';
import ListHandler from '../imports/api/server/ListHandler';
import List, { ListCollection } from '../imports/db/List';
import '../imports/api/server/RatingHandler';
import { Mongo } from 'meteor/mongo';
import dotenv from 'dotenv';
import './methods.js';
import './publications.js';
import { ServiceConfiguration } from 'meteor/service-configuration';
import '../imports/startup/server/indexes';

dotenv.config();

const githubClientId =
    Meteor.settings.private?.github?.clientId || process.env.GITHUB_CLIENT_ID;
const githubClientSecret =
    Meteor.settings.private?.github?.clientSecret ||
    process.env.GITHUB_CLIENT_SECRET;

const googleClientId =
    Meteor.settings.private?.google?.clientId || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret =
    Meteor.settings.private?.google?.clientSecret ||
    process.env.GOOGLE_CLIENT_SECRET;

Meteor.startup(() => {
    if (Meteor.isProduction) {
        Meteor.absoluteUrl.defaultOptions.rootUrl = 'https://www.thewatchlist.xyz/'; // create callback url to our domain
        console.log('Prod');
    } else if (Meteor.isDevelopment) {
        Meteor.absoluteUrl.defaultOptions.rootUrl = 'http://localhost:3000/';
        console.log('Dev');
    }

    const testCollection = new Mongo.Collection('test');
    testCollection.insert({ test: 'Connection check' }, (error, result) => {
        if (error) {
            console.error('Database connection failed:', error);
        } else {
            console.log('Successfully inserted document:', result);
        }
    });

    ServiceConfiguration.configurations.upsert(
        { service: 'github' },
        {
            $set: {
                loginStyle: 'popup',
                clientId: githubClientId,
                secret: githubClientSecret,
            },
        }
    );

    ServiceConfiguration.configurations.upsert(
        { service: 'google' },
        {
            $set: {
                loginStyle: 'popup',
                clientId: googleClientId,
                secret: googleClientSecret,
            },
        }
    );

    // Migration script to update followers and following arrays
    // Meteor.users.find({}).forEach((user) => {
    //     // Update following
    //     if (Array.isArray(user.following) && typeof user.following[0] === 'string') {
    //         const updatedFollowing = user.following.map((userId) => ({
    //             userId,
    //             followedAt: new Date(), 
    //         }));
    //         Meteor.users.update(user._id, { $set: { following: updatedFollowing } });
    //     }

    //     // Update followers
    //     if (Array.isArray(user.followers) && typeof user.followers[0] === 'string') {
    //         const updatedFollowers = user.followers.map((userId) => ({
    //             userId,
    //             followedAt: new Date(), 
    //         }));
    //         Meteor.users.update(user._id, { $set: { followers: updatedFollowers } });
    //     }
    // });

    // Note: Remove the above migration script after running it once to prevent it from running on every server start.
});
