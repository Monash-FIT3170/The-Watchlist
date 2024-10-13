// imports/startup/server/indexes.js

import { Meteor } from 'meteor/meteor';
import { MovieCollection, TVCollection } from '/imports/db/Content';
import { RatingCollection } from '../../db/Rating';

Meteor.startup(() => {
  // Ensure indexes are created
  MovieCollection._ensureIndex({ title: 1 });
  MovieCollection._ensureIndex({ genres: 1 });
  MovieCollection._ensureIndex({ language: 1 });
  MovieCollection._ensureIndex({ release_year: 1 });
  MovieCollection._ensureIndex({ popularity: -1 });
  
  TVCollection._ensureIndex({ title: 1 });
  TVCollection._ensureIndex({ genres: 1 });
  TVCollection._ensureIndex({ language: 1 });
  TVCollection._ensureIndex({ first_aired: 1 });
  TVCollection._ensureIndex({ popularity: -1 });

  RatingCollection._ensureIndex({ userId: 1 });

});
