import React, { useEffect } from 'react';
import { GiPopcorn } from 'react-icons/gi'

const Loading = ({ pageName, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative h-screen bg-dark text-purplish-grey">


    


      <div className="absolute top-0 left-0 right-0 flex justify-center">
        <p className="text-8xl font-bold font-anton text-shadow-custom bg-gradient-to-r from-magenta to-magenta bg-clip-text text-transparent animate-moveDown">
          The Watchlist
        </p>
      </div>

      <div className="flex items-center justify-center h-full">
      <div className="absolute left-0 right-0 flex justify-center opacity-0 animate-fadeInDelayed mb-44">
        <GiPopcorn className="text-9xl text-yellow-500 animate-jiggle" />
      </div>
        <p className="text-2xl mt-60 font-bold font-anton text-center opacity-0 animate-fadeIn">
          Welcome to the show
        </p>
      </div>
    </div>
  );
};

export default Loading;