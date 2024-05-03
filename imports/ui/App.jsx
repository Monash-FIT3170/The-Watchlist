import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { FaRegUserCircle  } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch  } from "react-icons/ai";
import HomePage from './HomePage.jsx';
import Navbar from './Navbar.tsx'; 
import SearchBar from './SearchBar.jsx'
import dummyLists from './DummyLists.jsx';
import FullContentList from './FullContentList.tsx';
// import Profile from './Profile.jsx';
// import AIPicks from './AIPicks.jsx';

// Static navbar data, add new entries when required, ensuring that the complimentary Route is created in the App component below
// ! Currently only search, home, profile and ai picks - don't add more
const staticNavbarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiOutlineHome />,
    cName: 'flex'
  },
  {
    title: 'Search',
    path: '/search',
    icon: <AiOutlineSearch  />,
    cName: 'flex'
  },
  {
      title: 'Profile',
      path: '/profile',
      icon: <FaRegUserCircle />,
      cName: 'flex'
  },
  {
      title: 'AI Picks',
      path: '/ai-picks',
      icon: <BsStars />,
      cName: 'flex'
  }
];

export const App = () => {
  return (
    <div className="app flex h-screen overflow-hidden bg-darkest text-white">
      <div id="navbar-wrapper">
        <Navbar staticNavData={staticNavbarData} listData={dummyLists} />
      </div>

      <div id="content" className="flex-auto p-4 bg-darker rounded-lg shadow-lg overflow-y-auto" style={{ margin: '1rem',  marginRight: '0.5rem', marginLeft: '0.5rem', height: 'calc(100% - 2rem)' }}>
        <Routes>
          <Route path="/search" element={<SearchBar />} />
          <Route path="/" exact element={<HomePage listData={dummyLists} />} />
          {dummyLists.map((list) => (
            <Route
              key={list.id}
              path={`/${list.id}`}
              element={<FullContentList title={list.title} images={list.images} />}
            />
          ))}
          {/* 
          - Uncomment the following routes and their imports once the Profile and AIPicks components are created:
          <Route path="/profile" exact element={<Profile /> } />
          <Route path="/ai-picks" element={ <AIPicks /> } />

          - If your component is rendered from INSIDE one of the main pages, DO NOT add here. You should create a new <Routes> within said page to avoid bloat. 
            https://ui.dev/react-router-nested-routes

          - FIXME: MovieList component here is currently acting as a demo 
          */}
        </Routes>
      </div>
    </div>
  );
};

