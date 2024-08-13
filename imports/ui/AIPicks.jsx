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



    const currentUser = useTracker(() => {
        const handler = Meteor.subscribe('userData', Meteor.userId());
        if (handler.ready()) {
          return Meteor.user();
        }
        return null;
      }, []);


    const { lists, subscribedLists, followUser, unfollowUser, ratings, loading2 } = useTracker(() => {
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
                const titles = randomSelections.map(item => item[0].title);
                setRandomMovieNames(titles);
                
                const movieTitles = [];
                const tvIds = [];

            
                // Separate selected items into movies and TV shows
                for (const selection of randomSelections) {
                    const item = selection[0]
                    if (item.contentType === 'Movie') {
                        movieTitles.push(item.title);
                    } else if (item.contentType === 'TV Show') {
                        tvIds.push(item.title);
                    }
                }
                
                

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
                if (tvIds.length > 0) {
                    const tvResponse = await fetch('/formatted_similar_tvs.json');
                    const tvRecommendationsJson = await tvResponse.json();

                    const recommendedTvIds = tvIds.flatMap(id => {
                        const recommendation = tvRecommendationsJson.find(rec => rec._id === id);
                        return recommendation ? recommendation.similar_content.slice(0, 5) : [];
                    });

                    // Fetch TV show details using the content.read handler
                    Meteor.call('content.search', { ids: recommendedTvIds }, (err, result) => {
                        if (err) {
                            console.error("Error fetching recommended TV shows:", err);
                        } else {
                            setRecommendedShows(result.tv || []);
                        }
                    });
                }
            } catch (error) {
                console.error("Error during recommendations fetching:", error);
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [lists, loading2]);


   if (loading2) return <div>Loading recommendations...</div>;

   
    // Map random movie names to their corresponding recommended movies
    const movieContentLists = recommendedMovies.map((result, index) => ({
        listId: `RecommendedMovies${index}`,
        title: `Because you liked ${result.title}`,
        content: result.movie.map(movie => ({
            ...movie,
            rating: globalRatings[movie.contentId]?.average || 0,
            type: "Movie"
        }))
    }));

// Map random TV show names to their corresponding recommended TV shows
const tvContentLists = randomMovieNames.map((name, index) => {
    const start = index * 5;
    const end = start + 5;

    return {
        listId: `RecommendedShows${index}`,
        title: `Because you liked "${name}"`,
        content: recommendedShows.slice(start, end).map(tv => ({
            ...tv,
            rating: globalRatings[tv.contentId]?.average || 0,
            type: "TV Show"
        }))
    };
});

    return (
        <div className="flex flex-col min-h-screen bg-darker">
            <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
            <Scrollbar className="w-full overflow-y-auto">
                {display === DISPLAY_MOVIES && movieContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-2">
                        <ContentList list={list} isUserOwned={false} />
                    </div>
                ))}
                {display === DISPLAY_SHOWS && tvContentLists.map(list => (
                    <div key={list.listId} className="px-8 py-5">
                        <ContentList list={list} isUserOwned={false} />
                    </div>
                ))}
            </Scrollbar>
        </div>
    );
}
