// imports/ui/App.jsx
import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Route, Routes, Navigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { useTracker } from 'meteor/react-meteor-data';

import Navbar from "./Navbar.jsx";
import SearchBar from "./SearchBar.jsx";
import Home from "./Home.jsx";
import UserProfile from "./UserProfile.jsx";
import NewListModal from "./NewListModal.tsx";
import UserDiscovery from './UserDiscovery.jsx';
import AIPicks from './AIPicks.jsx';
import Scrollbar from './ScrollBar';
import LoginPage from './LoginPage';
import UserProfilePage from './UserProfilePage';
import FollowersFollowingPage from "./FollowersFollowingPage.jsx";
import AllUsersPage from "./AllUsersPage.jsx";
import AllRatedContentPage from "./AllRatedContentPage.jsx";
import Loading from "./Loading.jsx";
import { ListCollection } from '../db/List';

const handleFollow = (userId) => {
  Meteor.call('followUser', userId, (error, result) => {
    if (error) {
      console.error('Error following user:', error);
    } else {
      console.log('Followed user successfully');
    }
  });
};

const handleUnfollow = (userId) => {
  Meteor.call('unfollowUser', userId, (error, result) => {
    if (error) {
      console.error('Error unfollowing user:', error);
    } else {
      console.log('Unfollowed user successfully');
    }
  });
};

const staticNavbarData = [
  {
    title: "Home",
    path: "/home",
    icon: <AiOutlineHome />,
    cName: "flex text-light hover-text-magenta",
  },
  {
    title: "Search",
    path: "/search",
    icon: <AiOutlineSearch />,
    cName: "flex text-light hover-text-magenta",
  },
  {
    title: "Profile",
    path: "/profile",
    icon: <FaRegUserCircle />,
    cName: "flex",
  },
  {
    title: "AI Picks",
    path: "/ai-picks",
    icon: <BsStars />,
    cName: "flex",
  },
];

export const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useTracker(() => Meteor.user());

  const { currentUser, userLoading } = useTracker(() => {
    const handler = Meteor.subscribe('userData', Meteor.userId());
    const user = Meteor.user();
    return {
      currentUser: user,
      userLoading: !handler.ready(),
    };
  }, []);

  const { userListsLoading, userLists } = useTracker(() => {
    const handler = Meteor.subscribe('userLists', Meteor.userId());
    const lists = ListCollection.find({ userId: Meteor.userId() }).fetch();
    return {
      userListsLoading: !handler.ready(),
      userLists: lists,
    };
  }, []);

  if (userLoading || userListsLoading) {
    return <Loading />;
  }

  if (!userLoading) {
    if (!user) {
      return (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      );
    }
  }

  if (!userLoading) {
    return (
      <div className="app flex h-screen overflow-hidden bg-darkest text-white">
        <div>
          <Navbar staticNavData={staticNavbarData} />
        </div>
        <div className="flex-auto p-0 bg-darkest rounded-lg shadow-lg mx-2 my-4 h-custom overflow-hidden">
          <Scrollbar className="h-custom">
            <Routes>
              <Route path="/search" element={<SearchBar currentUser={currentUser} />} />
              <Route path="/home" element={<Home currentUser={currentUser} userLists={userLists} />} />
              <Route path="/profile" element={<UserProfile currentUser={currentUser} />} />
              <Route path="/ai-picks" element={<AIPicks currentUser={currentUser} />} />
              <Route path="/user-discovery" element={<UserDiscovery currentUser={currentUser} />} />
              <Route path="/user/:userId" element={<UserProfilePage currentUser={currentUser} />} />
              <Route path="/followers-following/:userId/:type" element={<FollowersFollowingPage currentUser={currentUser} />} />
              <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
              <Route path="/all-users" element={<AllUsersPage onFollow={handleFollow} onUnfollow={handleUnfollow} currentUser={currentUser} />} />
              <Route path="/user/:userId/ratings" element={<AllRatedContentPage currentUser={currentUser} />} />
            </Routes>
          </Scrollbar>
        </div>
        {user && <NewListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </div>
    );
  }
};
