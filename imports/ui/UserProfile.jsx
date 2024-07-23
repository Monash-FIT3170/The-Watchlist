import React, { Fragment } from 'react';
import ContentList from './ContentList';
import ProfileCard from './ProfileCard'; // Import the new ProfileCard component
import CustomWatchLists from './CustomWatchLists';
import { useLists } from './ListContext'; // Import the context
import LoginPage from './LoginPage'; // Import a hypothetical LoginForm component
import { useTracker } from 'meteor/react-meteor-data';

export default function UserProfile() {
  const currentUser = useTracker(() => Meteor.user());
  const { lists } = useLists(); // Use lists from context

  const userLists = currentUser ? lists.filter(list => list.userId === currentUser._id) : [];

  console.log(currentUser);  // Ensure this returns what you expect

  const favouritesList = userLists.find(list => list.listType === "Favourite");
  const toWatchList = userLists.find(list => list.listType === "To Watch");
  const customWatchlists = userLists.filter(list => list.listType === "Custom");

  // Function to handle logout
  const handleLogout = () => {
    Meteor.logout((error) => {
      if (error) {
        console.error("Logout failed", error);
      } else {
        console.log("User logged out successfully");
      }
    });
  };

  return (
    <Fragment>
      {currentUser ? (
        <div className="flex flex-col gap-6">
          <ProfileCard
            userName={currentUser.username || "Default User"}
            ratings="5"
            followers="6"
            following="9"
            avatarUrl="./ExampleResources/user-avatar.jpg"
            userRealName="John"
            userDescription="Blåhaj description."
          />

          <button 
            onClick={handleLogout} 
            className="self-start px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Log Out
          </button>

          {favouritesList && <ContentList key={favouritesList._id} list={favouritesList} />}
          {toWatchList && <ContentList key={toWatchList._id} list={toWatchList} />}

          <CustomWatchLists listData={customWatchlists} />
        </div>
      ) : (
        <LoginPage />
      )}
    </Fragment>
  );
}
