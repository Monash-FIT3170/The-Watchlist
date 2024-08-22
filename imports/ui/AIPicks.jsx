import React, { useState, useEffect, useRef } from 'react';
import ContentListAI from './ContentListAI.jsx';
import Scrollbar from './ScrollBar';
import { Meteor } from 'meteor/meteor';
import AIPicksHeader from './AIPicksHeader.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import { RatingCollection } from '../db/Rating'; 



export default function AIPicks() {
    const DISPLAY_MOVIES = "Display Movie";
    const DISPLAY_SHOWS = "Display Show";
    // the number of recommendations collected for each movie/show. The onscreen display will be a selection from this pool
    const NUM_RECOMMENDATIONS = 35;
    // the number of slots to fill on the screen
    const NUM_LIST_SLOTS = 10;
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [globalRatings, setGlobalRatings] = useState({});
    const [loading, setLoading] = useState(false);

    // recommendedMovies and recommendedShows are a POOL of movies / shows associated with their assigned target movies / shows.
    // Each target movie / show will have a pool of movies corresponding to NUM_RECOMMENDATIONS
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [recommendedShows, setRecommendedShows] = useState([]);

    const [randomMovieNames, setRandomMovieNames] = useState([]);
    const [contentMovieNone, setContentMovieNone] = useState(true);
    const [contentTVNone, setContentTVNone] = useState(true);
    const [movieIntros, setMovieIntros] = useState([]);
    const [tvIntros, setTvIntros] = useState([]);
    const [refreshToggle, setRefreshToggle] = useState(false);


    // useRefs are similar to useState, except that a rerender will NOT be triggered when their value is updated
    //      The following useRefs hold the array of movies, and their corresponding recommendations TO BE DISPLAYED.
    //      IE. only a selection of 6 movies from the larger pool of the associated recommendedMovies 
    movieDisplayRef = useRef(new Array());
    tvDisplayRef = useRef(new Array());


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

    // runs whenever the page is loaded
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

    // runs whenever the user's favourites / towatch lists are changed
    // will grab a new selection of movies from these lists and then fetch a new pool of recommendations, stored in recommendedMovies / Shows
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
                    const recommendedMov = await fetchMovies(movieTitles);
                    console.log(recommendedMov);
                    
                    setRecommendedMovies(recommendedMov);

                }

                // Fetch recommendations for TV shows
                if (tvTitles.length > 0) {
                    const recommendedTvs = await fetchTvs(tvTitles);
                    setRecommendedShows(recommendedTvs);
                }
            } catch (error) {
                console.error("Error during recommendations fetching:", error);
                setLoading(false);
            }
        };

        if (!recommendedMovies.length && !recommendedShows.length) {
            fetchRecommendations();
        }
    }, [lists, loading2]);

    // Will run whenever 'recommendedMovies' or 'recommendedShows' is changed. 
    // Main occurence is when the page first loads, or when the users lists are updated
    useEffect(() => {
        if (recommendedMovies.length > 0 || recommendedShows.length > 0) {
            let updatedMovieIntros = movieIntros;
            let updatedTvIntros = tvIntros;
    
            // Generate intros if not already generated
            if (recommendedMovies.length > 0 && movieIntros.length === 0) {
                updatedMovieIntros = recommendedMovies.map(result => getRandomIntro(result.title));
                setMovieIntros(updatedMovieIntros);
            }
    
            if (recommendedShows.length > 0 && tvIntros.length === 0) {
                updatedTvIntros = recommendedShows.map(result => getRandomIntro(result.title));
                setTvIntros(updatedTvIntros);
            }
    
            // Map random movie names to their corresponding recommended movies
            let movieContentLists = recommendedMovies.map((result, index) => ({
                listId: `RecommendedMovies${index}`,
                title: updatedMovieIntros[index],
                content: result.movie.map(movie => ({
                    ...movie,
                    rating: globalRatings[movie.contentId]?.average || 0,
                    contentType: "Movie"
                }))
            }));
                
            // Map random TV show names to their corresponding recommended shows
            let tvContentLists = recommendedShows.map((result, index) => ({
                listId: `RecommendedShows${index}`,
                title: updatedTvIntros[index],
                content: result.tv.map(show => ({
                    ...show,
                    rating: globalRatings[show.contentId]?.average || 0,
                    contentType: "TV Show"
                }))
            }));
            
            // Ensure the lists only have NUM_LIST_SLOTS items
            movieContentLists.forEach((element) => {
                element["content"] = element["content"].filter((_, index) => index < NUM_LIST_SLOTS);
            });
            tvContentLists.forEach((element) => {
                element["content"] = element["content"].filter((_, index) => index < NUM_LIST_SLOTS);
            });
    
            // Update the display refs
            movieDisplayRef.current = movieContentLists;
            tvDisplayRef.current = tvContentLists;
        }
    }, [recommendedMovies, recommendedShows, movieIntros, tvIntros, globalRatings]);

    // Runs whenever the refreshToggle is set.
    // Will grab a random selection of movies / shows to display from the pool stored in recommendedMovies and recommendedShows.
    //! Bug introduced where the user must click refresh twice before the display is actually refreshed. 
    //! Believe this occurs due to the fact that useEffect triggers AFTER rendering has already occurred. IE. the display is the useRef's value from just BEFORE the refresh toggle is clicked
    useEffect(() => {
        if (!refreshToggle) return;

        setLoading(true);
    
        setTimeout(() => {
            const movieContentLists = recommendedMovies.map((result, index) => ({
                listId: `RecommendedMovies${index}`,
                title: movieIntros[index],
                content: result.movie.map(movie => ({
                    ...movie,
                    rating: globalRatings[movie.contentId]?.average || 0,
                    contentType: "Movie"
                }))
            }));

            const tvContentLists = recommendedShows.map((result, index) => ({
                listId: `RecommendedShows${index}`,
                title: tvIntros[index],
                content: result.tv.map(show => ({
                    ...show,
                    rating: globalRatings[show.contentId]?.average || 0,
                    contentType: "TV Show"
                }))
            }));

            const rand = Array.from({ length: NUM_LIST_SLOTS }, () => Math.floor(Math.random() * NUM_RECOMMENDATIONS));
            movieContentLists.forEach(element => {
                element.content = element.content.filter((_, index) => rand.includes(index));
            });
            tvContentLists.forEach(element => {
                element.content = element.content.filter((_, index) => rand.includes(index));
            });

            movieDisplayRef.current = movieContentLists;
            tvDisplayRef.current = tvContentLists;

            setLoading(false); // Hide loading animation
            setRefreshToggle(false); // Reset the refresh toggle
        }, 2000); // Simulate a 2-second loading time
    }, [refreshToggle]);


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

    //TODO: condense fetchMovies and fetchTvs into one function
    const fetchMovies = async (movieTitles) => {
        const movieResponse = await fetch('/similar_movies_titles.json');
        const movieRecommendationsJson = await movieResponse.json();
        
        const recommendedMoviePromises = movieTitles.map(title => {
            //! bug causing less than 6 items to appear on refresh could be happening due to following line? Although, quite unlikely
            const recommendedMovieIds = movieRecommendationsJson.find(rec => rec.Title === title)?.similar_movies.slice(0, NUM_RECOMMENDATIONS) || [];
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
        
        const recommended = await Promise.all(recommendedMoviePromises);
        return recommended;
    };

    const fetchTvs = async (tvTitles) => {
        
        const tvResponse = await fetch('/similar_tvs_title.json');
        const tvRecommendationsJson = await tvResponse.json();
        
        const recommendedTvPromises = tvTitles.map(title => {
            //! bug causing less than 6 items to appear on refresh could be happening due to following line? Although, quite unlikely
            const recommendedTvIds = tvRecommendationsJson.find(rec => rec.Title === title)?.similar_tvs.slice(0, NUM_RECOMMENDATIONS) || [];
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
        
        return await Promise.all(recommendedTvPromises);
    }
    
    // the value of the refreshToggle state doesn't matter
    // the change in value is used to trigger a useEffect that changes the display of movies / tv from the pool
    const toggleRefresh = () => {
        setRefreshToggle(prevToggle => !prevToggle);
    };
    
    
    if (loading2) return <div>Loading recommendations...</div>;

    if (loading) {
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
        <button className="px-6 py-3 font-bold text-white bg-gradient-to-r from-magenta to-less-dark rounded-full shadow-lg hover:from-less-dark hover:to-magenta
         focus:outline-none focus:ring-4 focus:ring-purple-300 transform active:scale-95 transition-transform duration-200" 
        onClick={() => toggleRefresh()}>Refresh AI Recommendations</button>
        <Scrollbar className="w-full overflow-y-auto">
            {display === DISPLAY_MOVIES && (
                contentMovieNone ? (
                    <div className="px-8 py-2 mt-10 text-white text-3xl">
                        Not enough Movies yet. Add some to your favourites or watchlist to get started!
                    </div>
                ) : (
                    movieDisplayRef.current.map(list => (
                        <div key={list.listId} className="px-8 py-2">
                            <ContentListAI list={list} isUserOwned={false} />
                        </div>
                    )
                )
                
            )
            )}
            {display === DISPLAY_SHOWS && (
                contentTVNone ? (
                    <div className="px-8 py-2 mt-10 text-white text-3xl">
                        Not enough TV Shows yet. Add some to your favourites or watchlist to get started!
                    </div>
                ) : (
                    tvDisplayRef.current.map(list => (
                        <div key={list.listId} className="px-8 py-2">
                            <ContentListAI list={list} isUserOwned={false} />
                        </div>
                    )
                )
                )
            )}
        </Scrollbar>
    </div>
);
}
