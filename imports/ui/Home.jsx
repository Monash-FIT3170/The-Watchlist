import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';
import dummyMovies from './DummyMovies';

const HomePage = () => {
  const [favourites, setFavourites] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);

  // Add your logic here to populate favourites and toWatchList

  return (
    <div className="min-h-screen overflow-auto">
      <h1 className="text-center text-6xl font-bold mb-5">Home</h1>
      <div className="flex justify-between">
        <Favourites dummyMovies={dummyMovies} />
        <ToWatch dummyMovies={dummyMovies} />
      </div>
    </div>
  );
};

export default HomePage;