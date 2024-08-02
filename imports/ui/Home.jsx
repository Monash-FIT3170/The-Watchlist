import React, { useState, useEffect } from 'react';
import Favourites from './Favourites';
import ToWatch from './ToWatch';
import ProfileDropdown from './ProfileDropdown';

const Home = ({ lists, currentUser }) => {

  return (
    <div className="flex justify-between space-x-5 overflow-hidden">
                  <div className="absolute top-4 right-4">
                <ProfileDropdown user={currentUser} />
            </div>
      <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <Favourites lists={lists} />
      </div>
      <div className="w-1/2 h-custom p-5 bg-darker text-light rounded-lg shadow-md flex justify-center overflow-hidden">
        <ToWatch lists={lists} />
      </div>
    </div>
  );
};

export default Home;
