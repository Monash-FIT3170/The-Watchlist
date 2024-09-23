// imports/startup/server/indexes.js

import { Meteor } from 'meteor/meteor';
import { MovieCollection, TVCollection } from '/imports/db/Content';

Meteor.startup(() => {
  // Ensure indexes are created
  MovieCollection._ensureIndex({ contentId: 1 });
  MovieCollection._ensureIndex({ title: 'text' }); // For text search
  TVCollection._ensureIndex({ contentId: 1 });
  TVCollection._ensureIndex({ title: 'text' }); // For text search
});
