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

dotenv.config();

const githubClientId = Meteor.settings.private.github.clientId;
const githubClientSecret = Meteor.settings.private.github.clientSecret;

const googleClientId = Meteor.settings.private.google.clientId;
const googleClientSecret = Meteor.settings.private.google.clientSecret;

Meteor.startup(() => {
    // Define or use an existing collection
    const testCollection = new Mongo.Collection('test');

    // Insert a test document (optional)
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
                clientId: githubClientId, // Replace with your GitHub Client ID
                secret: githubClientSecret // Replace with your GitHub Client Secret
            }
        }
    );
    // Configuration for Google
    ServiceConfiguration.configurations.upsert(
        { service: 'google' },
        {
            $set: {
                loginStyle: 'popup',
                clientId: googleClientId, // Replace with your Google Client ID
                secret: googleClientSecret // Replace with your Google Client Secret
            }
        }
    );

});

