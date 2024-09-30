// imports/db/Migrations.js

import { Mongo } from 'meteor/mongo';

/**
 * Migrations Collection
 * 
 * This collection tracks which migrations have been applied.
 * Each document should have a unique 'name' field.
 */
export const Migrations = new Mongo.Collection('migrations');
