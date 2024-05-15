import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai";
import HomePage from "./HomePage.jsx";
import Navbar from "./Navbar.tsx";
import SearchBar from "./SearchBar.jsx";
import dummyLists from "./DummyLists.jsx";
import dummyMovies from "./DummyMovies.jsx";
import dummyTvs from "./DummyTvs.jsx";
import FullContentList from "./FullContentList.tsx";
import Home from "./Home.jsx";
import UserProfile from "./UserProfile.jsx";
import MovieInfo from "./MovieInfo.tsx";
import TvInfo from "./TvInfo.tsx";
import NewListModal from "./NewListModal.tsx";
import { list } from "postcss";
// import Profile from './Profile.jsx';
// import AIPicks from './AIPicks.jsx';

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
  const [lists, setLists] = useState(dummyLists);
  const [isModalOpen, setIsModalOpen] = useState(false); // Add Lists PopUp isOpen

  const handleCreateList = (title) => {
    const listId = title.toLowerCase().split(" ").join("-");
    const newList = { listId, title, content: [] };
    setLists([...lists, newList]);
  };

  const handleDeleteList = (listId) => {
    if (listId === "favorite-shows" || listId === "must-watch") {
      console.log("This list cannot be deleted.");
      return;
    }
    const newList = lists.filter((list) => list.listId !== listId);
    setLists(newList);
  };

  const handleRenameList = (listId, newName) => {
    const newListId = newName.toLowerCase().split(" ").join("-");
    const newList = lists.map((list) =>
      list.listId === listId
        ? { ...list, title: newName, listId: newListId }
        : list
    );
    setLists(newList);
  };

  return (
    <div className="app flex h-screen overflow-hidden bg-darkest text-white">
      <div>
        <Navbar
          staticNavData={staticNavbarData}
          listData={lists}
          onAddList={() => setIsModalOpen(true)}
          onCreateList={handleCreateList}
        />
      </div>
      <div className="flex-auto p-0 bg-darkest rounded-lg shadow-lg mx-2 my-4 h-custom overflow-hidden">
        <div className="h-custom overflow-y-scroll scrollbar-webkit">
          <Routes>
            <Route path="/search" element={<SearchBar />} />
            {/* <Route path="/" exact element={<HomePage listData={dummyLists} />} /> */}
            <Route path="/home" element={<Home />} />
            {lists.map((list) => (
              <Route
                key={list.listId} // Change key to listId which is unique
                path={`/${list.listId}`} // Change path to use listId
                element={
                  <FullContentList
                    list={list}
                    onDeleteList={handleDeleteList}
                    onRenameList={handleRenameList}
                  />
                } // Updated to pass the entire list object
              />
            ))}
            <Route path="/profile" element={<UserProfile />} />
            {lists.map((movie) => (
              <Route
                key={movie.id} // Change key to listId which is unique
                path={`/movie${movie.id}`} // Change path to use listId
                element={<MovieInfo movie={movie} />} // Updated to pass the entire list object
              />
            ))}
            {dummyTvs.map((tv) => (
              <Route
                key={tv.id} // Change key to listId which is unique
                path={`/tv${tv.id}`} // Change path to use listId
                element={<TvInfo tv={tv} />} // Updated to pass the entire list object
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
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </div>
      <NewListModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateList}
      />
    </div>
  );
};
