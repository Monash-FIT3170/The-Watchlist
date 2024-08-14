import React, { useState, useEffect } from 'react';
import ContentList from './ContentList.jsx';
import Scrollbar from './ScrollBar';
import { Meteor } from 'meteor/meteor';
import AIPicksHeader from './AIPicksHeader.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import { RatingCollection } from '../db/Rating'; 



export default function AIPicks() {
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [globalRatings, setGlobalRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [recommendedShows, setRecommendedShows] = useState([]);
    const [randomMovieNames, setRandomMovieNames] = useState([]);
    const [contentMovieNone, setContentMovieNone] = useState(true);
    const [contentTVNone, setContentTVNone] = useState(true);



    const currentUser = useTracker(() => {
        const handler = Meteor.subscribe('userData', Meteor.userId());
        if (handler.ready()) {
          return Meteor.user();
        }
        return null;
      }, []);


    const { lists, loading2 } = useTracker(() => {
        const listsHandler = Meteor.subscribe('userLists', Meteor.userId());
        const subscribedHandler = Meteor.subscribe('subscribedLists', Meteor.userId());
        const ratingsHandler = Meteor.subscribe('userRatings', Meteor.userId());
    
        const lists = ListCollection.find({ userId: Meteor.userId() }).fetch();
        const subscribedLists = ListCollection.find({
          subscribers: { $in: [Meteor.userId()] }
        }).fetch();
        const ratings = RatingCollection.find({ userId: Meteor.userId() }).fetch();
    
        return {
          lists,
          subscribedLists,
          ratings,
          loading2: !listsHandler.ready() || !subscribedHandler.ready() || !ratingsHandler.ready(),
        };
      }, []);

    useEffect(() => {
        

        // Fetch global ratings using the Meteor method
        Meteor.call('ratings.getGlobalAverages', (error, result) => {
            if (!error) {
                setGlobalRatings(result);
            } else {
                console.error("Error fetching global ratings:", error);
            }
        });
    }, []);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                if (loading2) return;

                // Select up to 5 random movies or TV shows from the lists
                const selectRandomContent = (list, maxItems) => {
                    const selectedItems = [];
                    const listCopy = [...list.content];
                    
                    while (selectedItems.length < maxItems && listCopy.length > 0) {
                        const randomIndex = Math.floor(Math.random() * listCopy.length);
                        selectedItems.push(listCopy.splice(randomIndex, 1)[0]);
                        
                    }
                    return selectedItems;
                };


                const favouritesList = lists.find(list => list.listType === 'Favourite');
                const toWatchList = lists.find(list => list.listType === 'To Watch');
                

                const randomSelections = []
                //ensure we actually have content in the list before selecting random content   
                if (favouritesList.content.length !=0) {
                    randomSelections.push(selectRandomContent(favouritesList, 5));
                    
                }
                if (toWatchList.content.length !=0) {
                    randomSelections.push(selectRandomContent(toWatchList, 5));
                }

                

               
                //map the titles of the selections and set them
                const titles = []
                for (const selection of randomSelections) {
                    for (const item of selection) {
                        titles.push(item.title);
                    }
                }
                
                setRandomMovieNames(titles);
                
                const movieTitles = [];
                const tvTitles = [];

            
                // Separate selected items into movies and TV shows
                for (const selection of randomSelections) {
                    for (const item of selection) {
                    if (item.contentType === 'Movie') {
                        movieTitles.push(item.title);
                    } else if (item.contentType === 'TV Show') {
                        tvTitles.push(item.title);
                    }
                }
                }

                
                setContentMovieNone(movieTitles.length === 0);
                setContentTVNone(tvTitles.length === 0);

                
                // Fetch recommendations for movies
                if (movieTitles.length > 0) {
                    const movieResponse = await fetch('/similar_movies_titles.json');
                    const movieRecommendationsJson = await movieResponse.json();

                    const recommendedMoviePromises = movieTitles.map(title => {
                        const recommendedMovieIds = movieRecommendationsJson.find(rec => rec.Title === title)?.similar_movies.slice(0, 5) || [];
                        return new Promise((resolve, reject) => {
                            Meteor.call('content.search', { ids: recommendedMovieIds, title }, (err, result) => {
                                if (err) {
                                    console.error("Error fetching recommended movies:", err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
                    });

                    const recommendedMovies = await Promise.all(recommendedMoviePromises);
                    setRecommendedMovies(recommendedMovies);
                }

                // Fetch recommendations for TV shows
                if (tvTitles.length > 0) {
                    const tvResponse = await fetch('/similar_tvs_title.json');
                    const tvRecommendationsJson = await tvResponse.json();

                    const recommendedTvPromises = tvTitles.map(title => {
                        const recommendedTvIds = tvRecommendationsJson.find(rec => rec.Title === title)?.similar_tvs.slice(0, 5) || [];
                        return new Promise((resolve, reject) => {
                            Meteor.call('content.search', { ids: recommendedTvIds, title }, (err, result) => {
                                if (err) {
                                    console.error("Error fetching recommended movies:", err);
                                    reject(err);
                                } else {
                                    resolve(result);
                                }
                            });
                        });
                    });

                    const recommendedTvs = await Promise.all(recommendedTvPromises);
                    setRecommendedShows(recommendedTvs);
                }
            } catch (error) {
                console.error("Error during recommendations fetching:", error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [lists, loading2]);


   if (loading2) return <div>Loading recommendations...</div>;

   
   const randomIntros = [
    (title) => `Because you liked ${title}, you'll love these:`,
    (title) => `Based on your love for ${title}, we recommend:`,
    (title) => `${title} was a great choice! Here are more:`,
    (title) => `If you enjoyed ${title}, check out these:`,
    (title) => `We also loved ${title}, and here are the AI's other favourites:`,
    ];

    // Function to get a random intro
    const getRandomIntro = (title) => {
        const randomIndex = Math.floor(Math.random() * randomIntros.length);
        return randomIntros[randomIndex](title);
    };
    // Map random movie names to their corresponding recommended movies
    const movieContentLists = recommendedMovies.map((result, index) => ({
        listId: `RecommendedMovies${index}`,
        title: getRandomIntro(result.title),
        content: result.movie.map(movie => ({
            ...movie,
            rating: globalRatings[movie.contentId]?.average || 0,
            type: "Movie"
        }))
    }));

// Map random movie names to their corresponding recommended movies
const tvContentLists = recommendedShows.map((result, index) => ({
    listId: `RecommendedShows${index}`,
    title: getRandomIntro(result.title),
    content: result.tv.map(show => ({
        ...show,
        rating: globalRatings[show.contentId]?.average || 0,
        type: "TV Show"
    }))
}));

return (
    <div className="flex flex-col min-h-screen bg-darker">
        <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
        <Scrollbar className="w-full overflow-y-auto">
            {display === DISPLAY_MOVIES && (
                contentMovieNone ? (
                    <div className="px-8 py-2 mt-10 text-white text-3xl">
                        No Movies are added. Add some to your favourites or watchlist to get started!
                    </div>
                ) : (
                    movieContentLists.map(list => (
                        <div key={list.listId} className="px-8 py-2">
                            <ContentList list={list} isUserOwned={false} />
                        </div>
                    ))
                )
            )}
            {display === DISPLAY_SHOWS && (
                contentTVNone ? (
                    <div className="px-8 py-2 mt-10 text-white text-3xl">
                        No TV Shows are added. Add some to your favourites or watchlist to get started!
                    </div>
                ) : (
                    tvContentLists.map(list => (
                        <div key={list.listId} className="px-8 py-2">
                            <ContentList list={list} isUserOwned={false} />
                        </div>
                    ))
                )
            )}
        </Scrollbar>
    </div>
);
}
