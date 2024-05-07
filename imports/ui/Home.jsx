import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';
import dummyMovies from './DummyMovies';

const HomePage = () => {
  const [favourites, setFavourites] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);

  // Add your logic here to populate favourites and toWatchList

  return (
    <div className="flex justify-between mx-5 my-5 space-x-5">
      <div className="w-1/2 p-5 bg-darker text-light rounded-lg shadow-md mb-5 h-[90vh] flex justify-center">
        <Favourites dummyMovies={dummyMovies} />
      </div>
      <div className="w-1/2 p-5 bg-darker text-light rounded-lg shadow-md mb-5 h-[90vh] flex justify-center">
        <ToWatch dummyMovies={dummyMovies} />
      </div>
    </div>
  );
};

export default HomePage;