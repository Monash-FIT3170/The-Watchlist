import React, { useState } from 'react';
import dummyLists from './DummyLists.jsx';
import ContentList from './ContentList.tsx';
import Scrollbar from './ScrollBar';

export default function AIPicks() {
    const currentUser = 'user1';

    // Use react "state" to keep track of whether the component is displaying movies or TV shows
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);

    // Filter lists to get only the ones associated with the current user
    const userLists = dummyLists.filter(list => list.userId === currentUser);
    const userInfo = userLists[0] || {};

    const favouritesList = userLists.find(list => list.listId === "favorite-shows");
    const toWatchList = userLists.find(list => list.listId === "must-watch");
    const customWatchlists = userLists.filter(list => list.listId !== "favorite-shows" && list.listId !== "must-watch");

    // Method to get movies within content list
    function filterForMovies(watchList) {
        // Filter the content array for items of type 'movie'
        const movies = watchList.content.filter(item => item.type === 'movie');
        // Return the filtered list
        return {
            ...watchList, // Include other properties of the watchList
            content: movies // Replace the content array with the filtered movies
        };
    }

    // Method to get tv shows within content list
    function filterForShows(watchList) {
        // Filter the content array for items of type 'tv'
        const shows = watchList.content.filter(item => item.type === 'tv');
        // Return the filtered list
        return {
            ...watchList, // Include other properties of the watchList
            content: shows // Replace the content array with the filtered movies
        };
    }

    return (
        <div className="flex flex-col gap-6 overflow-y-hidden h-custom">
            <div className="bg-darker rounded-lg items-center flex flex-col justify-center">
                <h1 className="text-5xl font-semibold mt-8">AI Picks</h1>
                <div className="my-8 items-center w-1/2 flex flex-row">
                    <button
                        className="border border-solid rounded-full px-8 py-4 w-1/3 focus:bg-magenta"
                        onClick={() => {
                            setDisplay(DISPLAY_MOVIES);
                        }}
                    >
                        Movies
                    </button>
                    <div className="w-1/3"></div>
                    <button
                        className="border border-solid rounded-full px-8 py-4 w-1/3 focus:bg-magenta"
                        onClick={() => {
                            setDisplay(DISPLAY_SHOWS);
                        }}
                    >
                        TV Shows
                    </button>
                </div>
            </div>
            <Scrollbar className="overflow-y-auto scrollbar-webkit">
                {/* Display Movies */}
                {display === DISPLAY_MOVIES && (
                    <>
                        <ContentList key={filterForMovies(favouritesList).listId} list={filterForMovies(favouritesList)} />,
                        <ContentList key={filterForMovies(toWatchList).listId} list={filterForMovies(toWatchList)} />
                    </>
                )}

                {/* Display TV Shows */}
                {display === DISPLAY_SHOWS && (
                    <>
                        <ContentList key={filterForShows(favouritesList).listId} list={filterForShows(favouritesList)} />,
                        <ContentList key={filterForShows(toWatchList).listId} list={filterForShows(toWatchList)} />
                    </>
                )}
            </Scrollbar>
        </div>
    );
}
