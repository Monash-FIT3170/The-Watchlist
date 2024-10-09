// server/migrations/setAllListsPublic.js

import { Meteor } from 'meteor/meteor';
import { Migrations } from '../../imports/db/Migrations';
import { ListCollection } from '../../imports/db/List';

/**
 * Migration: setAllListsPublic
 * 
 * This migration sets the 'visibility' field of all lists to 'PUBLIC'.
 * It records the migration in the Migrations collection to prevent re-running.
 */
const setAllListsPublic = () => {
  const migrationName = 'setAllListsPublic';

  // Check if the migration has already been run
  if (Migrations.findOne({ name: migrationName })) {
    console.log(`Migration '${migrationName}' already applied. Skipping...`);
    return;
  }

  console.log(`Applying migration: ${migrationName}`);

  // Use rawCollection for bulk operations to improve performance
  const bulk = ListCollection.rawCollection().initializeUnorderedBulkOp();

  // Find all lists where visibility is not 'PUBLIC' and update them
  bulk.find({ visibility: { $ne: 'PUBLIC' } }).update({ $set: { visibility: 'PUBLIC' } }, { multi: true });

  // Execute the bulk operation
  bulk.execute((err, result) => {
    if (err) {
      console.error(`Migration '${migrationName}' failed:`, err);
    } else {
      // Depending on the MongoDB driver version, the result may have different properties
      const modifiedCount = result.nModified || result.modifiedCount || 0;
      console.log(`Migration '${migrationName}' completed: ${modifiedCount} lists updated to 'PUBLIC' visibility.`);
      
      // Record that the migration has been run
      Migrations.insert({ name: migrationName, date: new Date() });
    }
  });
};

export default setAllListsPublic;
