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
  <div className="flex items-center h-72 p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-md">
    <div className="flex items-center gap-4">
      <img
        src="./ExampleResources/user-avatar.jpg" // replace with actual URL
        alt="avatar"
        className="w-56 h-56 object-cover rounded-full shadow-2xl"
      />
      <div>
        <h2 className="p-2 text-lg">Profile</h2>
        <h2 className="p-2 text-6xl font-bold">{userLists[0]?.userName || 'Username'}</h2>
        <div className="flex gap-2">
          <span className="p-2 rounded-md text-lg flex-initial gap-2">5 Public Playlists</span>
          <span className="p-2 rounded-md text-lg flex-initial gap-2">6 Followers</span>
          <span className="p-2 rounded-md text-lg flex-initial gap-2">9 Following</span>
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
