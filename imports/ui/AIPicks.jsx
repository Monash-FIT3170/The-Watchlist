import React, { useState, useEffect } from 'react';
import dummyLists from './DummyLists.jsx';
import ContentList from './ContentList.tsx';
import { useLists } from './ListContext'; // Import the context

export default function AIPicks() {
    const currentUser = 1;

    console.log("movies and tvs")
    // console.log(movies)
    // console.log(tvs)

    // Use react "state" to keep track of whether the component is displaying movies or TV shows
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Filter lists to get only the ones associated with the current user
    const { lists } = useLists(); // Use lists from context
    console.log("lists:");
    console.log(lists);

    useEffect(() => {
        if (lists && lists.length > 0) {
            setIsLoading(false); // Set loading to false when lists are loaded
        }
    }, [lists]);

    if (isLoading) {
        return <div>Loading...</div>; // Show loading indicator while lists are loading
    }

    const userLists = lists.filter(list => list.userId === currentUser);
    console.log("userLists");
    console.log(userLists);

    const userInfo = userLists[0] || {};

    // const actionComedyList = userLists.find(list => list.title === "Action Comedies");
    // const sciFiList = userLists.find(list => list.title === "Sci-Fi Favorites");
    // const toWatchList = userLists.find(list => list.listType === "To Watch");
    const customWatchlists = userLists.filter(list => list.listType === "Custom");

    // Method to get movies within content list
    function filterForMovies(watchList) {
        if (!watchList || !watchList.content) return { content: [] }; // Check for null or undefined watchList
        const movies = watchList.content.filter(item => item.type === 'Movie');
        return {
            ...watchList,
            content: movies
        };
    }

    // Method to get tv shows within content list
    function filterForShows(watchList) {
        if (!watchList || !watchList.content) return { content: [] }; // Check for null or undefined watchList
        const shows = watchList.content.filter(item => item.type === 'TV Show');
        return {
            ...watchList,
            content: shows
        };
    }

    return (
        <div className="flex flex-col gap-6 overflow-y-hidden h-custom">
            <div className="bg-darker rounded-lg items-center flex flex-col justify-center">
                <h1 className="text-5xl font-semibold mt-8">AI Picks</h1>
                <div className="my-8 items-center w-1/2 flex flex-row">
                    <button
                        className="border border-solid rounded-full px-8 py-4 w-1/3 focus:bg-magenta"
                        onClick={() => setDisplay(DISPLAY_MOVIES)}
                    >
                        Movies
                    </button>
                    <div className="w-1/3"></div>
                    <button
                        className="border border-solid rounded-full px-8 py-4 w-1/3 focus:bg-magenta"
                        onClick={() => setDisplay(DISPLAY_SHOWS)}
                    >
                        TV Shows
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto scrollbar-webkit">
                {/* Display Movies */}
                {display === DISPLAY_MOVIES && actionComedyList && sciFiList && (
                    <>
                        {customWatchlists.map(list => (
                            <ContentList key={filterForMovies(list)._id} list={filterForMovies(list)} />
                        ))}
                    </>
                )}

                {/* Display TV Shows */}
                {display === DISPLAY_SHOWS && actionComedyList && sciFiList && (
                    <>
                        {customWatchlists.map(list => (
                            <ContentList key={filterForShows(list)._id} list={filterForShows(list)} />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
