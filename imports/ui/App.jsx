import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { Route, Routes, Navigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import Navbar from "./Navbar.tsx";
import SearchBar from "./SearchBar.jsx";
import FullContentList from "./FullContentList.tsx";
import Home from "./Home.jsx";
import UserProfile from "./UserProfile.jsx";
import MovieInfo from "./MovieInfo.tsx";
import TvInfo from "./TvInfo.tsx";
import NewListModal from "./NewListModal.tsx";
import { ListsProvider } from './ListContext';
// import Profile from './Profile.jsx';
// import AIPicks from './AIPicks.jsx';

const FetchTest = () => {
  useEffect(() => {
    Meteor.call("content.read", {}, (error, response) => {
      if (error) {
        console.error("Error fetching data:", error);
      } else {
        console.log("Received data:", response);
      }
    });
  }, []);

  return <div>Check console for fetched data.</div>;
};

// Static navbar data, add new entries when required, ensuring that the complimentary Route is created in the App component below
// ! Currently only search, home, profile and ai picks - don't add more
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
  // State to hold movies from the backend

  const [movies, setMovies] = useState([]);
  const [tvs, setTvs] = useState([]);
  const [lists, setLists] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    Meteor.call("content.read", {}, (error, response) => {
      if (error) {
        console.error("Error fetching content:", error);
      } else {
        if (response.movie) {
          setMovies(response.movie);
        }
        if (response.tv) {
          setTvs(response.tv);
        }
      }
    });
  }, []);

  return (
    <ListsProvider>
      <div className="app flex h-screen overflow-hidden bg-darkest text-white">
        <div>
          <Navbar staticNavData={staticNavbarData} />
        </div>
        <div className="flex-auto p-0 bg-darkest rounded-lg shadow-lg mx-2 my-4 h-custom overflow-hidden">
          <div className="h-custom overflow-y-scroll scrollbar-webkit">
            <Routes>
              <Route path="/fetch-test" element={<FetchTest />} />
              <Route path="/search" element={<SearchBar movies={movies} tvs={tvs} />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<UserProfile />} />
              {movies.map((movie) => (
                <Route key={movie.id} path={`/Movie${movie.id}`} element={<MovieInfo movie={movie} />} />
              ))}
              {tvs.map((tv) => (
                <Route key={tv.id} path={`/TV Show${tv.id}`} element={<TvInfo tv={tv} />} />
              ))}
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </div>
        <NewListModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </ListsProvider>
  );
};