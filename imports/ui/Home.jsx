import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';
import './Home.css';

const HomePage = () => {
  const [favourites, setFavourites] = useState([]);
  const [toWatchList, setToWatchList] = useState([]);

  // Add your logic here to populate favourites and toWatchList

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto' }}>
      <h1 className="home-title">Home</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Favourites favourites={favourites} />
        <ToWatch toWatchList={toWatchList} />
      </div>
    </div>
  );
};

export default HomePage;