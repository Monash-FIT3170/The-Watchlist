import React, { useState, useEffect } from 'react';
import ContentList from './ContentList.jsx';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown.jsx';
import AIPicksHeader from './AIPicksHeader.jsx';

export default function AIPicks({ movies, tvs, currentUser }) {
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [globalRatings, setGlobalRatings] = useState({});

    const genres = [
        "Action", "Adventure", "Animation", "Anime", "Awards Show", "Children",
        "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Food",
        "Game Show", "History", "Home and Garden", "Horror", "Indie", "Martial Arts",
        "Mini-Series", "Musical", "Mystery", "News", "Podcast", "Reality",
        "Romance", "Science Fiction", "Soap", "Sport", "Suspense", "Talk Show",
        "Thriller", "Travel", "War", "Western"
    ];

    useEffect(() => {
        // Call the Meteor method to fetch global ratings
        Meteor.call('ratings.getGlobalAverages', (error, result) => {
            if (!error) {
                setGlobalRatings(result);
            } else {
                console.error("Error fetching global ratings:", error);
            }
        });
    }, []);

    let movieContentLists = genres.map(genre => {
        const genreMovies = movies.filter(item => item.genres.includes(genre)).slice(0, 10);
        return {
            listId: genre + "Movies",
            title: genre,
            content: genreMovies.map(movie => ({
                ...movie,  // Spread the entire movie object
                rating: globalRatings[movie.id]?.average || 0,
                type: "Movie"
            }))
        };
    });

    console.log("TVs in ai picks:")
    console.log(tvs)

    let showContentLists = genres.map(genre => {
        const genreShows = tvs.filter(item => item.genres?.includes(genre)).slice(0, 10);
        return {
            listId: genre + "Shows",
            title: genre,
            content: genreShows.map(tv => ({
                ...tv,  // Spread the entire TV show object
                rating: globalRatings[tv.id]?.average || 0,
                type: "TV Show"
            }))
        };
    });

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
            <Scrollbar className="w-full overflow-y-auto">
                {display === "Display Movie" && movieContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-2">
                        <ContentList list={list} isUserOwned={false} />
                    </div>
                ))}
                {display === "Display Show" && showContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-5">
                        <ContentList list={list} isUserOwned={false} />
                    </div>
                ))}
            </Scrollbar>
        </div>
    );
}
