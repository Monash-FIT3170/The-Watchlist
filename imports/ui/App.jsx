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

  const fetchLists = () => {
    Meteor.call("list.read", { userId: 1 }, (error, response) => { // Temporary userId: 1
      if (error) {
        console.error("Error fetching lists:", error);
      } else {
        setLists(response);
      }
    });
  };

  const handleCreateList = (title) => {
    const userId = 1; // Temporary userId: 1
    // const userId = Meteor.userId(); // Uncomment this when user authentication is implemented
    const listType = "Custom";
    const newList = { userId, title, listType, content: [] };
    Meteor.call("list.create", newList, (error) => {
      if (error) {
        console.error("Error creating list:", error);
      } else {
        fetchLists();
      }
    });
  };

  const handleDeleteList = (listId) => {
    const userId = 1; // Temporary userId: 1
    // const userId = Meteor.userId(); // Uncomment this when user authentication is implemented
    Meteor.call("list.delete", { listId, userId }, (error) => {
      if (error) {
        console.error("Error deleting list:", error);
      } else {
        fetchLists();
      }
    });
  };

  const handleRenameList = (listId, newName) => {
    const userId = 1; // Temporary userId: 1
    // const userId = Meteor.userId(); // Uncomment this when user authentication is implemented
    Meteor.call("list.update", { listId, userId, updateFields: { title: newName } }, (error) => {
      if (error) {
        console.error("Error renaming list:", error);
      } else {
        fetchLists();
      }
    });
  };


  useEffect(() => {
    // Fetch content from the Meteor backend
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

    // Fetch lists from the backend
    fetchLists();
  }, []);

  return (
    <div className="app flex h-screen overflow-hidden bg-darkest text-white">
      <div>
        <Navbar
          staticNavData={staticNavbarData}
          listData={lists}
          onAddList={handleCreateList}
          onDeleteList={handleDeleteList}
          onRenameList={handleRenameList}
        />
      </div>
      <div className="flex-auto p-0 bg-darkest rounded-lg shadow-lg mx-2 my-4 h-custom overflow-hidden">
        <div className="h-custom overflow-y-scroll scrollbar-webkit">
          <Routes>
            <Route path="/fetch-test" element={<FetchTest />} />{" "}
            {/* add route for testing */}
            <Route
              path="/search"
              element={<SearchBar movies={movies} tvs={tvs} lists={lists} />}
            />
            <Route path="/home" element={<Home lists={lists} />} />
            {lists.map((list) => (
              <Route
                key={list._id} // Change key to listId which is unique
                path={`/${list._id}`} // Change path to use listId
                element={
                  <FullContentList
                    list={list}
                    onDeleteList={handleDeleteList}
                    onRenameList={handleRenameList}
                  />
                }
              />
            ))}
            <Route path="/profile" element={<UserProfile lists={lists} />} />
            {movies.map((movie) => (
              <Route
                key={movie.id} // Change key to listId which is unique
                path={`/movie${movie.id}`} // Change path to use listId
                element={<MovieInfo movie={movie} />} // Updated to pass the entire list object
              />
            ))}
            {tvs.map((tv) => (
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
