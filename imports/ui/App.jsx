// imports/ui/App.jsx

import React, { useState, useMemo } from "react";
import { Meteor } from "meteor/meteor";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import { GiPodium } from "react-icons/gi";
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
import FollowersFollowingPage from "./pages/FollowersFollowingPage.jsx";
import AllUsersPage from "./pages/AllUsersPage.jsx";
import AllRatedContentPage from "./pages/AllRatedContentPage.jsx";
import Loading from "./pages/Loading.jsx";
import Settings from "./pages/Settings.jsx";
import FollowRequests from "./pages/FollowRequests.jsx";
import { useEffect } from "react";
import RootProvider from "./contexts/RootProvider.jsx";
import TopRated from "./pages/TopRated.jsx";
import LoadingNoAnimation from "./pages/LoadingNoAnimation.jsx";

// Create a Context for User Data (if needed)
export const UserContext = React.createContext();
import SharedWatchlistPage from "./pages/SharedWatchlistPage.jsx";

export const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation(); // Use to check the current route
  const [loggedIn, setLoggedIn] = useState(false);
  const [previousPath, setPreviousPath] = useState('');
  const [previousPreviousPath, setPreviousPreviousPath] = useState('');
  const [loadingComplete, setLoadingComplete] = useState(false);

  // Define static navbar data
  const staticNavbarData = useMemo(() => [
    { title: "Home", path: "/home", icon: <AiOutlineHome />, cName: "flex text-light hover-text-magenta" },
    { title: "Search", path: "/search", icon: <AiOutlineSearch />, cName: "flex text-light hover-text-magenta" },
    { title: "Profile", path: "/profile", icon: <FaRegUserCircle />, cName: "flex" },
    { title: "AI Picks", path: "/ai-picks", icon: <BsStars />, cName: "flex" },
    {title: "Top Rated", path: "/top-rated", icon: <GiPodium />, cName: "flex"},
  ], []);


  //track the previous path for loading purposes
  useEffect(() => {
    setPreviousPreviousPath(previousPath);
    setPreviousPath(location.pathname);
  
  }, [location]);

  // Track currentUser reactively from Meteor.users collection
  const currentUser = useTracker(() => {
    const userId = Meteor.userId();
    setLoggedIn(userId ? true : false); // If userId is found, then a user is logged in
    return Meteor.users.findOne({ _id: userId });
    // return Meteor.user()
  }, []);

  // Conditionally subscribe based on user login status
  const userProfileHandle = useTracker(() => {
    if (currentUser) {
      return Meteor.subscribe('userProfileData', currentUser._id);
    }
    return { ready: () => true };
  }, [currentUser?._id]);
  
  const userListsHandle = useTracker(() => {
    if (currentUser) {
      return Meteor.subscribe('userLists', currentUser._id);
    }
    return { ready: () => true };
  }, [currentUser?._id]);
 
  // Track userLists reactively
  const userLists = useTracker(() => {
    if (currentUser) {
      return ListCollection.find({ userId: currentUser._id }).fetch();
    }
    return [];
  }, [currentUser]);

  // Get ratingsCount using publish-counts
  const ratingsCount = useTracker(() => Counts.get('userRatingsCount'), []);

  // Determine loading state
  const loading = (!userProfileHandle.ready() || !userListsHandle.ready() || !currentUser);

  //check if we are coming from the login page
  const cameFromLoginPage = previousPreviousPath === '/login';


  if (loading && loggedIn || !loadingComplete) {
    return !cameFromLoginPage ?(
    <Loading pageName="The Watchlist" onComplete={() => setLoadingComplete(true)} />) :( 

    <LoadingNoAnimation pageName="The Watchlist" pageDesc="Logging in..."/>);
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
    // <RootProvider>
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
                {/* Unified UserProfile for both own and others' profiles */}
                <Route path="/profile" element={<UserProfile currentUser={currentUser} ratingsCount={ratingsCount}/>} />
                <Route path="/user/:userId" element={<UserProfile currentUser={currentUser} ratingsCount={ratingsCount}/>} />
                <Route path="/ai-picks" element={<AIPicks currentUser={currentUser} />} />
                <Route path="/user-discovery" element={<UserDiscovery currentUser={currentUser} />} />
                <Route path="/followers-following/:userId/:type" element={<FollowersFollowingPage currentUser={currentUser} />} />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/all-users" element={<AllUsersPage currentUser={currentUser} />} />
                <Route path="/user/:userId/ratings" element={<AllRatedContentPage currentUser={currentUser} />} />
                <Route path="/settings" element={<Settings currentUser={currentUser} />} />
                <Route path="/follow-requests" element={<FollowRequests currentUser={currentUser} />} />
                <Route path="/list/:listId" element={<SharedWatchlistPage currentUser={currentUser}/>} />
                <Route path="/top-rated" element={<TopRated currentUser={currentUser} />} />
              </Routes>
            </Scrollbar>
          ) : (
            <Scrollbar className="h-custom">
            <Routes>
              <Route path="/home" element={<Home currentUser={currentUser} userLists={userLists} />} />
            </Routes>
            </Scrollbar>
          )}
        </div>
        {currentUser && <NewListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
      </div>
    // </RootProvider>
  );
};

export default App;
