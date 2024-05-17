import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';
import dummyLists from './movie.json';

const HomePage = () => {
  const [favourites, setFavourites] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);

  // Add your logic here to populate favourites and toWatchList

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex justify-between space-x-5 flex-grow overflow-hidden">
        <div className="w-1/2 p-5 bg-darker text-light rounded-lg shadow-md flex flex-col">
          <Favourites dummyMovies={dummyLists} />
        </div>
        <div className="w-1/2 p-5 bg-darker text-light rounded-lg shadow-md flex flex-col">
          <ToWatch dummyMovies={dummyLists} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
