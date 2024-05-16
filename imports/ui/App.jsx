import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { FaRegUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import HomePage from './HomePage.jsx';
import Navbar from './Navbar.tsx';
import SearchBar from './SearchBar.jsx';
import dummyLists from './DummyLists.jsx';
import dummyMovies from './DummyMovies.jsx';
import dummyTvs from './DummyTvs.jsx';
import FullContentList from './FullContentList.tsx';
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import MovieInfo from './MovieInfo.tsx';
import TvInfo from './TvInfo.tsx';
import Scrollbar from './ScrollBar.jsx';

// Static navbar data, add new entries when required, ensuring that the complimentary Route is created in the App component below
const staticNavbarData = [
  {
    title: 'Home',
    path: '/home',
    icon: <AiOutlineHome />,
    cName: 'flex text-light hover-text-magenta'
  },
  {
    title: 'Search',
    path: '/search',
    icon: <AiOutlineSearch />,
    cName: 'flex text-light hover-text-magenta'
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

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <div className={`h-custom ${isHomePage ? '' : 'scrollable-container'}`}>
      <Scrollbar className={isHomePage ? '' : 'h-full'}>
        <Routes>
          <Route path="/search" element={<SearchBar />} />
          <Route path="/home" element={<Home />} />
          {dummyLists.map((list) => (
            <Route
              key={list.listId}
              path={`/${list.listId}`}
              element={<FullContentList list={list} />}
            />
          ))}
          <Route path="/profile" element={<UserProfile />} />
          {dummyMovies.map((movie) => (
            <Route
              key={movie.id}
              path={`/movie${movie.id}`}
              element={<MovieInfo movie={movie} />}
            />
          ))}
          {dummyTvs.map((tv) => (
            <Route
              key={tv.id}
              path={`/tv${tv.id}`}
              element={<TvInfo tv={tv} />}
            />
          ))}
          <Route path="/" element={<Navigate to="/home" />} />
        </Routes>
      </Scrollbar>
    </div>
  );
};

export const App = () => {
  return (
    <div className="app flex h-screen overflow-hidden bg-darkest text-white">
      <div>
        <Navbar staticNavData={staticNavbarData} listData={dummyLists} />
      </div>
      <div className="flex-auto p-0 bg-darkest rounded-lg shadow-lg mx-2 my-4 h-custom overflow-hidden">
        <AppContent />
      </div>
    </div>
  );
};

export default App;
