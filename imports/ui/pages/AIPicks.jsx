import React, { useState, useEffect } from 'react';
import ContentListAI from '../components/lists/ContentListAI.jsx';
import Scrollbar from '../components/scrollbar/ScrollBar.jsx';
import { Meteor } from 'meteor/meteor';
import AIPicksHeader from '../components/headers/AIPicksHeader.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../../db/List.tsx';
import { RatingCollection } from '../../db/Rating.tsx'; 

export default function AIPicks() {
    // Constants
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const NUM_RECOMMENDATIONS = 35; // Number of recommendations to fetch per title
    const NUM_LIST_SLOTS = 5; // Number of items to display per list

    // State variables
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [globalRatings, setGlobalRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState({ movies: [], shows: [] });
    const [displayRecommendations, setDisplayRecommendations] = useState({ movies: [], shows: [] });
    const [contentMovieNone, setContentMovieNone] = useState(true);
    const [contentTVNone, setContentTVNone] = useState(true);

    // Get current user
    const currentUser = useTracker(() => {
        const handler = Meteor.subscribe('userData', Meteor.userId());
        if (handler.ready()) {
            return Meteor.user();
        }
        return null;
    }, []);

    // Get user lists and ratings
    const { lists, loadingLists } = useTracker(() => {
        const listsHandler = Meteor.subscribe('userLists', Meteor.userId());
        const ratingsHandler = Meteor.subscribe('userRatings', Meteor.userId());

        const lists = ListCollection.find({ userId: Meteor.userId() }).fetch();
        const ratings = RatingCollection.find({ userId: Meteor.userId() }).fetch();

        return {
            lists,
            ratings,
            loadingLists: !listsHandler.ready() || !ratingsHandler.ready(),
        };
    }, []);

    // Fetch global ratings when component mounts
    useEffect(() => {
        Meteor.call('ratings.getGlobalAverages', (error, result) => {
            if (!error) {
                setGlobalRatings(result);
            } else {
                console.error("Error fetching global ratings:", error);
            }
        });
    }, []);

    // Fetch recommendations when lists change
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (loadingLists) return;

            setLoading(true);

            try {
                // Get 'Favourite' and 'To Watch' lists
                const favouritesList = lists.find(list => list.listType === 'Favourite');
                const toWatchList = lists.find(list => list.listType === 'To Watch');

                // Collect content from both lists
                const allContent = [];
                if (favouritesList && favouritesList.content.length > 0) {
                    allContent.push(...favouritesList.content);
                }
                if (toWatchList && toWatchList.content.length > 0) {
                    allContent.push(...toWatchList.content);
                }

                // If no content, set contentMovieNone and contentTVNone to true and return
                if (allContent.length === 0) {
                    setContentMovieNone(true);
                    setContentTVNone(true);
                    setRecommendations({ movies: [], shows: [] });
                    setLoading(false);
                    return;
                }

                // Randomly select up to 5 items from allContent
                const selectedContent = selectRandomContent(allContent, 5);

                // Separate into movieTitles and tvTitles
                const movieTitles = selectedContent.filter(item => item.contentType === 'Movie').map(item => item.title);
                const tvTitles = selectedContent.filter(item => item.contentType === 'TV Show').map(item => item.title);

                setContentMovieNone(movieTitles.length === 0);
                setContentTVNone(tvTitles.length === 0);

                const recommendedMovies = movieTitles.length > 0 ? await fetchContentRecommendations(movieTitles, 'movies') : [];
                const recommendedShows = tvTitles.length > 0 ? await fetchContentRecommendations(tvTitles, 'tv') : [];

                setRecommendations({ movies: recommendedMovies, shows: recommendedShows });
                setLoading(false);
            } catch (error) {
                console.error("Error during recommendations fetching:", error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [lists, loadingLists]);

    // Update displayRecommendations when recommendations change
    useEffect(() => {
        if (recommendations.movies.length > 0 || recommendations.shows.length > 0) {
            updateDisplayRecommendations();
        }
    }, [recommendations]);

    // Function to select random content
    const selectRandomContent = (contentList, maxItems) => {
        const selectedItems = [];
        const listCopy = [...contentList];

        while (selectedItems.length < maxItems && listCopy.length > 0) {
            const randomIndex = Math.floor(Math.random() * listCopy.length);
            selectedItems.push(listCopy.splice(randomIndex, 1)[0]);
        }
        return selectedItems;
    };

    // Function to fetch content recommendations
    const fetchContentRecommendations = async (titles, contentType) => {
        // contentType is 'movies' or 'tv'
        const filePath = contentType === 'movies' ? '/ml_matrices/similar_movies_titles.json' : '/ml_matrices/similar_tvs_title.json';

        const response = await fetch(filePath);
        const recommendationsJson = await response.json();

        const recommendedContentPromises = titles.map(title => {
            const recommendationData = recommendationsJson.find(rec => rec.Title === title);
            const recommendedIds = recommendationData ? (contentType === 'movies' ? recommendationData.similar_movies : recommendationData.similar_tvs) : [];
            const idsToFetch = recommendedIds.slice(0, NUM_RECOMMENDATIONS);

            return new Promise((resolve, reject) => {
                Meteor.call('content.search', { ids: idsToFetch, title }, (err, result) => {
                    if (err) {
                        console.error(`Error fetching recommended ${contentType} for ${title}:`, err);
                        reject(err);
                    } else {
                        resolve({
                            title: title,
                            recommendations: result[contentType === 'movies' ? 'movie' : 'tv']
                        });
                    }
                });
            });
        });

        const recommended = await Promise.all(recommendedContentPromises);
        return recommended;
    };

    // Function to update displayRecommendations
    const updateDisplayRecommendations = () => {
        const updatedMovies = recommendations.movies.map(recommendation => {
            const content = recommendation.recommendations.slice(0, NUM_LIST_SLOTS).map(item => ({
                ...item,
                rating: globalRatings[item.contentId]?.average || 0,
                contentType: "Movie"
            }));

            return {
                listId: `RecommendedMovies-${recommendation.title}`,
                title: getRandomIntro(recommendation.title),
                content
            };
        });

        const updatedShows = recommendations.shows.map(recommendation => {
            const content = recommendation.recommendations.slice(0, NUM_LIST_SLOTS).map(item => ({
                ...item,
                rating: globalRatings[item.contentId]?.average || 0,
                contentType: "TV Show"
            }));

            return {
                listId: `RecommendedShows-${recommendation.title}`,
                title: getRandomIntro(recommendation.title),
                content
            };
        });

        setDisplayRecommendations({ movies: updatedMovies, shows: updatedShows });
    };

    // Function to refresh recommendations
    const refreshRecommendations = () => {
        if (recommendations.movies.length > 0 || recommendations.shows.length > 0) {
            setLoading(true);

            // Randomly select different items for display
            const updatedMovies = recommendations.movies.map(recommendation => {
                const content = selectRandomItems(recommendation.recommendations, NUM_LIST_SLOTS).map(item => ({
                    ...item,
                    rating: globalRatings[item.contentId]?.average || 0,
                    contentType: "Movie"
                }));

                return {
                    listId: `RecommendedMovies-${recommendation.title}`,
                    title: getRandomIntro(recommendation.title),
                    content
                };
            });

            const updatedShows = recommendations.shows.map(recommendation => {
                const content = selectRandomItems(recommendation.recommendations, NUM_LIST_SLOTS).map(item => ({
                    ...item,
                    rating: globalRatings[item.contentId]?.average || 0,
                    contentType: "TV Show"
                }));

                return {
                    listId: `RecommendedShows-${recommendation.title}`,
                    title: getRandomIntro(recommendation.title),
                    content
                };
            });

            setDisplayRecommendations({ movies: updatedMovies, shows: updatedShows });
            setLoading(false);
        }
    };

    // Function to select random items from an array
    const selectRandomItems = (array, numItems) => {
        const selectedItems = [];
        const arrayCopy = [...array];

        while (selectedItems.length < numItems && arrayCopy.length > 0) {
            const randomIndex = Math.floor(Math.random() * arrayCopy.length);
            selectedItems.push(arrayCopy.splice(randomIndex, 1)[0]);
        }
        return selectedItems;
    };

    // getRandomIntro function
    const getRandomIntro = (title) => {
        const randomIntros = [
            `Because you liked ${title}, you'll love these:`,
            `Based on your love for ${title}, we recommend:`,
            `${title} was a great choice! Here are more:`,
            `If you enjoyed ${title}, check out these:`,
            `We also loved ${title}, and here are the AI's other favourites:`,
        ];
        const randomIndex = Math.floor(Math.random() * randomIntros.length);
        return randomIntros[randomIndex];
    };

    if (loadingLists || loading) {
        return (
            <div className="flex flex-col min-h-screen bg-darker">
                <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
                <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
                    <div className="-mt-52 animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 mb-4"></div>
                    <p className="text-xl font-semibold">Loading Updated AI Recommendations...</p>
                    <p className="text-gray-400 mt-2">Please wait a moment while we fetch your content.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
            <button
                className="mx-4 px-6 py-3 font-bold text-white bg-gradient-to-r from-magenta to-less-dark rounded-full shadow-lg hover:from-less-dark hover:to-magenta
                focus:outline-none focus:ring-4 focus:ring-purple-300 transform active:scale-95 transition-transform duration-200" 
                onClick={refreshRecommendations}
            >
                Refresh AI Recommendations
            </button>
            <Scrollbar className="w-full overflow-y-auto">
                {display === DISPLAY_MOVIES && (
                    contentMovieNone ? (
                        <div className="px-8 py-2 mt-10 text-white text-3xl">
                            Not enough Movies yet. Add some to your favourites or watchlist to get started!
                        </div>
                    ) : (
                        displayRecommendations.movies.map(list => (
                            <div key={list.listId} className="px-8 py-2">
                                <ContentListAI list={list} isUserOwned={false} />
                            </div>
                        ))
                    )
                )}
                {display === DISPLAY_SHOWS && (
                    contentTVNone ? (
                        <div className="px-8 py-2 mt-10 text-white text-3xl">
                            Not enough Shows yet. Add some to your favourites or watchlist to get started!
                        </div>
                    ) : (
                        displayRecommendations.shows.map(list => (
                            <div key={list.listId} className="px-8 py-2">
                                <ContentListAI list={list} isUserOwned={false} />
                            </div>
                        ))
                    )
                )}
            </Scrollbar>
        </div>
    );
}
