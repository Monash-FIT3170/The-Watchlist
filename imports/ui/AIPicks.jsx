import React, { useState } from 'react';
import ContentList from './ContentList.tsx';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown.jsx';
import AIPicksHeader from './AIPicksHeader.jsx';

export default function AIPicks({ movies, tvs, currentUser }) {
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);

    const genres = [
        "Action", "Adventure", "Animation", "Anime", "Awards Show", "Children",
        "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Food",
        "Game Show", "History", "Home and Garden", "Horror", "Indie", "Martial Arts",
        "Mini-Series", "Musical", "Mystery", "News", "Podcast", "Reality",
        "Romance", "Science Fiction", "Soap", "Sport", "Suspense", "Talk Show",
        "Thriller", "Travel", "War", "Western"
    ];

    let movieContentLists = genres.map(genre => {
        const genreMovies = movies.filter(item => item.genres.includes(genre)).slice(0, 10);
        return {
            listId: genre + "Movies",
            title: genre,
            content: genreMovies
        };
    });

    let showContentLists = genres.map(genre => {
        const genreShows = tvs.filter(item => item.genres.includes(genre)).slice(0, 10);
        return {
            listId: genre + "Shows",
            title: genre,
            content: genreShows
        };
    });

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
            <Scrollbar className="w-full overflow-y-auto">
                {display === "Display Movie" && movieContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-2">
                        <ContentList list={list} />
                    </div>
                ))}
                {display === "Display Show" && showContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-5">
                        <ContentList list={list} />
                    </div>
                ))}
            </Scrollbar>

        </div>
    );
}
