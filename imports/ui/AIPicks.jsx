import React, { useState, useEffect } from 'react';
import ContentList from './ContentList.tsx';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown.jsx';

export default function AIPicks({ movies, tvs, currentUser }) {
    // console.log("Movies")
    // console.log(movies)
    // console.log(tvs)

    // Use react "state" to keep track of whether the component is displaying movies or TV shows
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [isLoading, setIsLoading] = useState(true); // Loading state

    // Create content lists for each genre
    genres = [
        "Action", "Adventure", "Animation", "Anime", "Awards Show", "Children",
        "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Food",
        "Game Show", "History", "Home and Garden", "Horror", "Indie", "Martial Arts",
        "Mini-Series", "Musical", "Mystery", "News", "Podcast", "Reality",
        "Romance", "Science Fiction", "Soap", "Sport", "Suspense", "Talk Show",
        "Thriller", "Travel", "War", "Western"
    ]
    let movieContentLists = []
    let showContentLists = []
    genres.forEach(genre => {
        const genreMovies = movies.filter(item => item.genres.includes(genre)).slice(0, 10)
        const movieContentList = {
            listId: genre + "Movies",
            title: genre,
            content: genreMovies
        }
        movieContentLists.push(movieContentList)

        const genreShows = tvs.filter(item => item.genres.includes(genre)).slice(0, 10)
        const showContentList = {
            listId: genre + "Shows",
            title: genre,
            content: genreShows
        }
        showContentLists.push(showContentList)
    })

    // useEffect(() => {
    //     if (movies && movies > 0) {
    //         setIsLoading(false); // Set loading to false when lists are loaded
    //     }
    // }, [movies]);

    // if (isLoading) {
    //     return <div>Loading...</div>; // Show loading indicator while lists are loading
    // }

    return (
        <div className="flex flex-col gap-6 overflow-y-hidden h-custom">
                  <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
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
            <Scrollbar className="overflow-y-auto scrollbar-webkit">
                {/* Display Movies */}
                {display === DISPLAY_MOVIES && movieContentLists && (
                    <>
                        {movieContentLists.map(list => (
                            <ContentList key={list._id} list={list} />
                        ))}
                    </>
                )}

                {/* Display TV Shows */}
                {display === DISPLAY_SHOWS && showContentLists && (
                    <>
                        {showContentLists.map(list => (
                            <ContentList key={list._id} list={list} />
                        ))}
                    </>
                )}
            </Scrollbar>
        </div>
    );
}
