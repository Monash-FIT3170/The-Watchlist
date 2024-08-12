import React, { useState, useEffect } from 'react';
import ContentList from './ContentList.jsx';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown.jsx';
import AIPicksHeader from './AIPicksHeader.jsx';

export default function AIPicks({ currentUser }) {
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [globalRatings, setGlobalRatings] = useState({});
    const [movies, setMovies] = useState([]);
    const [tvs, setTvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        // Fetch all genres from the backend
        Meteor.call('genres.getAll', (error, result) => {
            if (!error) {
                setGenres(result);
            } else {
                console.error("Error fetching genres:", error);
            }
        });

        // Fetch content using content.read method
        Meteor.call('content.read', { limit: 500 }, (error, result) => {  // Adjust the limit as needed
            if (!error) {
                setMovies(result.movie || []);
                setTvs(result.tv || []);
            } else {
                console.error("Error fetching content:", error);
            }
            setLoading(false);
        });

        // Fetch global ratings using the Meteor method
        Meteor.call('ratings.getGlobalAverages', (error, result) => {
            if (!error) {
                setGlobalRatings(result);
            } else {
                console.error("Error fetching global ratings:", error);
            }
        });
    }, []);

    let movieContentLists = genres.map(genre => {
        const genreMovies = movies.filter(item => item.genres && item.genres.includes(genre)).slice(0, 10);
        return {
            listId: genre + "Movies",
            title: genre,
            content: genreMovies.map(movie => ({
                ...movie,  // Spread the entire movie object
                rating: globalRatings[movie.contentId]?.average || 0,
                contentType: "Movie"
            }))
        };
    });

    let showContentLists = genres.map(genre => {
        const genreShows = tvs.filter(item => item.genres && item.genres.includes(genre)).slice(0, 10);
        return {
            listId: genre + "Shows",
            title: genre,
            content: genreShows.map(tv => ({
                ...tv,  // Spread the entire TV show object
                rating: globalRatings[tv.contentId]?.average || 0,
                contentType: "TV Show"
            }))
        };
    });


    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
            <Scrollbar className="w-full overflow-y-auto">
                {!loading && display === "Display Movie" && movieContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-2">
                        <ContentList list={list} isUserOwned={false} />
                    </div>
                ))}
                {!loading && display === "Display Show" && showContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-5">
                        <ContentList list={list} isUserOwned={false} />
                    </div>
                ))}
            </Scrollbar>
        </div>
    );
}
