import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';
import dummyLists from './DummyLists';

const HomePage = () => {
  const [favourites, setFavourites] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);

  // Add your logic here to populate favourites and toWatchList

  return (
    <div className="flex justify-between space-x-5">
      <div className="w-1/2 p-5 bg-darker text-light rounded-lg shadow-md h-custom flex justify-center">
        <Favourites dummyMovies={dummyLists} />
      </div>
      <div className="w-1/2 p-5 bg-darker text-light rounded-lg shadow-md h-custom flex justify-center">
        <ToWatch dummyMovies={dummyLists} />
      </div>
    </div>
  );
};

export default HomePage;