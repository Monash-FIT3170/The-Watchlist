import React from 'react';
import dummyLists from './DummyLists'; // Adjust the path if necessary
import ContentList from './ContentList';
import ProfileCard from './ProfileCard'; // Import the new ProfileCard component
import CustomWatchLists from './CustomWatchLists';

export default function UserProfile() {
  // Simulate current user (replace this with actual user ID)
  const currentUser = 'user1';

  // Filter lists to get only the ones associated with the current user
  const userLists = dummyLists.filter(list => list.userId === currentUser);
  const userInfo = userLists[0] || {};

  const favouritesList = userLists.find(list => list.listId == "favorite-shows")
  const toWatchList = userLists.find(list => list.listId == "must-watch")
  const customWatchlists = userLists.filter(list => list.listId != "favorite-shows" && list.listId != "must-watch")

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard
        userName={userInfo.userName}
        ratings="5" // replace with actual count if available
        followers="6" // replace with actual count
        following="9" // replace with actual count
        avatarUrl="./ExampleResources/user-avatar.jpg" // replace with actual URL
        userRealName="John"
        userDescription="Blåhaj is a plush toy manufactured and sold by the Swedish company IKEA. Modeled after a blue shark and made of recycled polyester, the toy has gained prominence on social media as a popular internet meme.        "
      />

      {/* User's Content Lists */}
      <ContentList key={favouritesList.listId} list={favouritesList} />
      <ContentList key={toWatchList.listId} list={toWatchList} />
      {/* {userLists.map(list => (
        <ContentList key={list.listId} list={list} />
      ))} */}

      {/* User's Watchlists */}
      <CustomWatchLists listData={customWatchlists} />
    </div>
  );
}
