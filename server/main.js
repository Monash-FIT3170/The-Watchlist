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

dotenv.config();

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

});

