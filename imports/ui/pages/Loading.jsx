import React, { useEffect } from 'react';

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
    <div className="flex flex-col items-center h-screen bg-dark text-white">
      <p className="text-8xl font-bold font-anton text-shadow-custom bg-gradient-to-r from-magenta via-purple-800 to-magenta bg-clip-text text-transparent animate-moveDown">
        The Watchlist
      </p>
      <p className="text-2xl mt-40 animate-fadeIn">
        Welcome to the show
      </p>
    </div>
  );
};

export default Loading;