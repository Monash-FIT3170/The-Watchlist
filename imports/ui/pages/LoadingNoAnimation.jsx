import React from 'react';
import { GiPopcorn } from 'react-icons/gi'

const LoadingNoAnimation = ({ pageName, pageDesc}) => {
    

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-dark text-purplish-grey">
      {/* Popcorn Icon */}
      <div className="flex justify-center mb-4">
        <GiPopcorn className="text-9xl text-yellow-500 animate-jiggle" />
      </div>

      {/* Title: The Watchlist */}
      <p className="text-8xl font-bold font-anton text-shadow-custom bg-gradient-to-r from-magenta to-magenta bg-clip-text text-transparent mb-4">
        The Watchlist
      </p>

      {/* Description: Welcome to the show */}
      <p className="text-2xl font-bold font-anton text-center">
        {pageDesc}
      </p>
    </div>
  );
};

export default LoadingNoAnimation;