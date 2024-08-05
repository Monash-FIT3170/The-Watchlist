import React, { useState, useEffect } from 'react';
import HomeList from './HomeList'

const Home = ({ lists }) => {
  return (
    <div className="flex justify-between space-x-5 overflow-hidden">
      <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <HomeList lists={lists} title="Favourites" listType="Favourite" />
      </div>
      <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <HomeList lists={lists} title="To Watch" listType="To Watch" />
      </div>
    </div>
  );
};

export default Home;
