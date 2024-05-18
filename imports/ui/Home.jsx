import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';

const Home = ({ lists }) => {
  return (
    <div className="flex justify-between space-x-5 overflow-hidden">
      <div className="w-1/2 h-screen p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <Favourites lists={lists} />
      </div>
      <div className="w-1/2 h-screen p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <ToWatch lists={lists} />
      </div>
    </div>
  );
};

export default Home;
