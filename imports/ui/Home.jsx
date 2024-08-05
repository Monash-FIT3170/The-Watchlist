import React, { useState, useEffect } from 'react';
import ProfileDropdown from './ProfileDropdown';
import HomeList from './HomeList';

const Home = ({ lists, currentUser }) => {

  return (
    <div className="flex justify-between overflow-hidden">
      <div className="absolute top-4 right-8">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <HomeList lists={lists} title="Favourites" listType="Favourite" />
      </div>
      <div className="mx-5 w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <HomeList lists={lists} title="To Watch" listType="To Watch" />
      </div>
    </div>
  );
}  

export default Home;
