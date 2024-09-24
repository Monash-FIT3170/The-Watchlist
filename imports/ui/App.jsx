// imports/ui/App.jsx

import React, { useState, useMemo } from "react";
import { Meteor } from "meteor/meteor";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import { Counts } from 'meteor/tmeasday:publish-counts';

import Navbar from "./components/navbar/Navbar.jsx";
import SearchBar from "./pages/SearchBar.jsx";
import Home from "./pages/Home.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import NewListModal from "./modals/NewListModal.tsx";
import UserDiscovery from './pages/UserDiscovery.jsx';
import AIPicks from './pages/AIPicks.jsx';
import Scrollbar from './components/scrollbar/ScrollBar.jsx';
import LoginPage from "./pages/LoginPage.jsx";
import UserProfilePage from './pages/UserProfilePage.jsx';
import FollowersFollowingPage from "./pages/FollowersFollowingPage.jsx";
import AllUsersPage from "./pages/AllUsersPage.jsx";
import AllRatedContentPage from "./pages/AllRatedContentPage.jsx";
import Loading from "./pages/Loading.jsx";
import Settings from "./pages/Settings.jsx";
import FollowRequests from "./pages/FollowRequests.jsx";
import { useEffect } from "react";
import { SearchProvider } from "./contexts/SearchContext.js";

// Create a Context for User Data (if needed)
export const UserContext = React.createContext();
import SharedWatchlistPage from "./pages/SharedWatchlistPage.jsx";

export const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation(); // Use to check the current route

  // Define static navbar data
  const staticNavbarData = useMemo(() => [
    { title: "Home", path: "/home", icon: <AiOutlineHome />, cName: "flex text-light hover-text-magenta" },
    { title: "Search", path: "/search", icon: <AiOutlineSearch />, cName: "flex text-light hover-text-magenta" },
    { title: "Profile", path: "/profile", icon: <FaRegUserCircle />, cName: "flex" },
    { title: "AI Picks", path: "/ai-picks", icon: <BsStars />, cName: "flex" },
  ], []);

  // Subscribe to userProfileData at the top level
  const userProfileHandle = useTracker(() => Meteor.subscribe('userProfileData', Meteor.userId()), []);

  // Subscribe to userLists
  const userListsHandle = useTracker(() => Meteor.subscribe('userLists', Meteor.userId()), []);

  // Track currentUser reactively from Meteor.users collection
  const currentUser = useTracker(() => {
    const userId = Meteor.userId();
    return Meteor.users.findOne({ _id: userId });
  }, []);

  // Track userLists reactively
  const userLists = useTracker(() => ListCollection.find({ userId: Meteor.userId() }).fetch(), [Meteor.userId()]);

  // Get ratingsCount using publish-counts
  const ratingsCount = useTracker(() => Counts.get('userRatingsCount'), []);

  // Determine loading state
  const loading = !userProfileHandle.ready() || !userListsHandle.ready() || !currentUser;

  if (loading) {
    return <Loading />;
  }

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  return (
    <SearchProvider>
      <div className="app flex h-screen overflow-hidden bg-darkest text-white">
        <div className="flex-none">
          <Navbar staticNavData={staticNavbarData} currentUser={currentUser}/>
        </div>
        <div className="flex-auto p-0 bg-darkest rounded-lg shadow-lg mx-2 my-4 h-custom overflow-hidden">
          {location.pathname !== '/home' ? (
            <Scrollbar className="h-custom">
              <Routes>
                <Route path="/search" element={<SearchBar currentUser={currentUser} />} />
                <Route path="/home" element={<Home currentUser={currentUser} userLists={userLists} />} />
                <Route path="/profile" element={<UserProfile currentUser={currentUser} ratingsCount={ratingsCount} loading={loading} />} />
                <Route path="/ai-picks" element={<AIPicks currentUser={currentUser} />} />
                <Route path="/user-discovery" element={<UserDiscovery currentUser={currentUser} />} />
                <Route path="/user/:userId" element={<UserProfilePage currentUser={currentUser} />} />
                <Route path="/followers-following/:userId/:type" element={<FollowersFollowingPage currentUser={currentUser} />} />
                <Route path="/" element={currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                <Route path="/all-users" element={<AllUsersPage currentUser={currentUser} />} />
                <Route path="/user/:userId/ratings" element={<AllRatedContentPage currentUser={currentUser} />} />
                <Route path="/settings" element={<Settings currentUser={currentUser} />} />
                <Route path="/follow-requests" element={<FollowRequests currentUser={currentUser} />} />
                <Route path="/watchlist/:listId" element={<SharedWatchlistPage/>} />
              </Routes>
            </Scrollbar>
          ) : (
            <Routes>
              <Route path="/home" element={<Home currentUser={currentUser} userLists={userLists} />} />
            </Routes>
          )}
        </div>
        {currentUser && <NewListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </div>
    </SearchProvider>
  );
};

export default App;
