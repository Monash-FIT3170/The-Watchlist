// UserProfile.jsx
import React from 'react';
import dummyLists from './DummyLists'; // Adjust the path if necessary
import ContentList from './ContentList';

export default function UserProfile() {
  // Simulate current user (replace this with actual user ID)
  const currentUser = 'user1';

  // Filter lists to get only the ones associated with the current user
  const userLists = dummyLists.filter(list => list.userId === currentUser);

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Section */}
      <div className="p-4 bg-fuchsia-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <img
            src="./ExampleResources/user-avatar.jpg" // replace with actual URL
            alt="avatar"
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h2 className="text-lg font-bold">{userLists[0]?.userName || 'Username'}</h2>
            <div className="flex gap-2">
              <span>400 Ratings</span>
              <span>400 Followers</span>
              <span>400 Following</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Content Lists */}
      {userLists.map(list => (
        <ContentList key={list.listId} list={list} />
      ))}
    </div>
  );
}
