import React from 'react';
import ProfileDropdown from '../profileDropdown/ProfileDropdown';

const AIPicksHeader = ({ setDisplay, currentDisplay, currentUser }) => {
  const DISPLAY_MOVIES = "Display Movie";
  const DISPLAY_SHOWS = "Display Show";
  const DISPLAY_TRENDING = "Display Trending";
  const DISPLAY_GENRES = "Display Genres";

  return (
    <div className="flex flex-col justify-end items-start w-full h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <h1 className="text-7xl text-white font-bold mb-8">AI Picks</h1>
      <div className="flex gap-4 mb-4">
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${currentDisplay === DISPLAY_MOVIES ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'}`}
          onClick={() => setDisplay(DISPLAY_MOVIES)}
        >
          Movies
        </button>
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${currentDisplay === DISPLAY_SHOWS ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`}
          onClick={() => setDisplay(DISPLAY_SHOWS)}
        >
          TV Shows
        </button>
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${currentDisplay === DISPLAY_TRENDING ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`}
          onClick={() => setDisplay(DISPLAY_TRENDING)}
        >
          Trending
        </button>
        <button
          className={`text-lg text-white py-2 px-6 rounded-full shadow ${currentDisplay === DISPLAY_GENRES ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'} border-transparent border`}
          onClick={() => setDisplay(DISPLAY_GENRES)}
        >
          Genres
        </button>
      </div>
    </div>
  );
};

export default AIPicksHeader;
