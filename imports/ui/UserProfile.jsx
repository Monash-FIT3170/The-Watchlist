import React from 'react';
import ContentList from './ContentList';
import ProfileCard from './ProfileCard'; // Import the new ProfileCard component
import CustomWatchLists from './CustomWatchLists';
import { useLists } from './ListContext'; // Import the context

export default function UserProfile() { // Remove lists prop
  const currentUser = 1;
  const { lists } = useLists(); // Use lists from context

  const userLists = lists.filter(list => list.userId === currentUser);
  const userInfo = userLists[0] || {};

  console.log(userLists);  // Ensure this returns what you expect

  const favouritesList = userLists.find(list => list.listType === "Favourite");
  const toWatchList = userLists.find(list => list.listType === "To Watch");
  const customWatchlists = userLists.filter(list => list.listType === "Custom");

  return (
    <div className="flex flex-col gap-6">
      <ProfileCard
        userName={userInfo.userName || "Default User"}
        ratings="5"
        followers="6"
        following="9"
        avatarUrl="./ExampleResources/user-avatar.jpg"
        userRealName="John"
        userDescription="Blåhaj description."
      />

      {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} />}
      {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} />}
      
      <CustomWatchLists listData={customWatchlists} />
    </div>
  );
}
