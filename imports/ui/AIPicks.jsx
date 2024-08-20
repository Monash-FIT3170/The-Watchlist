import React, { useState, useEffect, useRef } from 'react';
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
    const NUM_RECOMMENDATIONS = 35;
    const NUM_LIST_SLOTS = 6;
    const [display, setDisplay] = useState(DISPLAY_MOVIES);
    const [globalRatings, setGlobalRatings] = useState({});
    const [loading, setLoading] = useState(true);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [recommendedShows, setRecommendedShows] = useState([]);
    const [randomMovieNames, setRandomMovieNames] = useState([]);
    const [contentMovieNone, setContentMovieNone] = useState(true);
    const [contentTVNone, setContentTVNone] = useState(true);
    const [movieIntros, setMovieIntros] = useState([]);
    const [tvIntros, setTvIntros] = useState([]);
    const [movieLockToggle, setMovieLockToggle] = useState([]);
    const [tvLockToggle, setTvLockToggle] = useState([]);

    movieToggle = useRef(new Array());
    tvToggle = useRef(new Array())



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
                    const recommendedMov = await fetchMovies(movieTitles);
                    console.log(recommendedMov);
                    
                    setRecommendedMovies(recommendedMov);
                    setMovieLockToggle(new Array(recommendedMov.length).fill(true));
                    // movieToggle.current = new Array(recommendedMov.length).fill(true);
                }

                // Fetch recommendations for TV shows
                if (tvTitles.length > 0) {
                    const recommendedTvs = await fetchTvs(tvTitles);
                    setRecommendedShows(recommendedTvs);
                    setTvLockToggle(new Array(recommendedTvs.length).fill(true));
                    // tvToggle.current = new Array(recommendedTvs.length).fill(true);
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

    useEffect(() => {
        if (recommendedMovies.length > 0 && movieIntros.length === 0) {
            const generatedMovieIntros = recommendedMovies.map(result => getRandomIntro(result.title));
            setMovieIntros(generatedMovieIntros);
        }

        if (recommendedShows.length > 0 && tvIntros.length === 0) {
            const generatedTvIntros = recommendedShows.map(result => getRandomIntro(result.title));
            setTvIntros(generatedTvIntros);
        }
    }, [recommendedMovies, recommendedShows]);

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


   if (loading2) return <div>Loading recommendations...</div>;

   
   rand = Array.from({ length: NUM_LIST_SLOTS }, () => Math.floor(Math.random() * NUM_RECOMMENDATIONS));
    // Map random movie names to their corresponding recommended movies
    let movieContentLists = recommendedMovies.map((result, index) => ({
        listId: `RecommendedMovies${index}`,
        title: movieIntros[index],
        content: result.movie.map(movie => ({
            ...movie,
            rating: globalRatings[movie.contentId]?.average || 0,
            contentType: "Movie"
        }))
    }));
    // console.log(movieContentLists);
    
// Map random movie names to their corresponding recommended movies
let tvContentLists = recommendedShows.map((result, index) => ({
    listId: `RecommendedShows${index}`,
    title: tvIntros[index],
    content: result.tv.map(show => ({
        ...show,
        rating: globalRatings[show.contentId]?.average || 0,
        contentType: "TV Show"
    }))
}));
// console.log(movieContentLists)
// rand = Array.from({ length: NUM_LIST_SLOTS }, () => Math.floor(Math.random() * NUM_RECOMMENDATIONS));

//! need to move this to a hook
movieContentLists.forEach((element, index) => {
    // if (!movieLockToggle[index]){
    if (!movieToggle.current[index]){
        element["content"] = element["content"].filter((_,index) => rand.includes(index))
    }
    else {
        element["content"] = element["content"].filter((_,index) => index < NUM_LIST_SLOTS)
    }
});
tvContentLists.forEach((element, index) => {
    // if (!tvLockToggle[index]){
    if (!tvToggle.current[index]){
        element["content"] = element["content"].filter((_,index) => rand.includes(index))
    }
    else {
        element["content"] = element["content"].filter((_,index) => index < NUM_LIST_SLOTS)
    }
});
console.log(movieContentLists)

console.log(tvContentLists);

// setMovieLockToggle(new Array(recommendedMovies.length).fill(true));
// setTvLockToggle(new Array(recommendedShows.length).fill(true));

const fetchMovies = async (movieTitles) => {
    const movieResponse = await fetch('/similar_movies_titles.json');
    const movieRecommendationsJson = await movieResponse.json();

    const recommendedMoviePromises = movieTitles.map(title => {
        const recommendedMovieIds = movieRecommendationsJson.find(rec => rec.Title === title)?.similar_movies.slice(0, NUM_RECOMMENDATIONS - 1) || [];
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

// helper function to return just the number from a string
const retNum = (str) => { 
    let num = str.replace(/[^0-9]/g, ''); 
    return parseInt(num,10); 
}

const lockToggle = (listId) => {
    // listId is a string which will be "RecommendedMovies" if the element is for a movie or "RecommendedShows" if a tvshow.
    // The final character of listId is an int corresponding to the index of the content in the 'recommendedMovies' / 'recommendedShows' useState.
    
    if (listId.includes("RecommendedMovies")){
        // recommendedMovies[retNum(listId)].movie = ;
        let temp = [...movieLockToggle];
        temp[retNum(listId)] = !movieLockToggle[retNum(listId)];
        setMovieLockToggle(temp);

        // // recommendedMovies[retNum(listId)].movie = ;
        // let temp = [...movieToggle.current];
        // temp[retNum(listId)] = !movieToggle.current[retNum(listId)];
        // movieToggle.current = temp;


    }
    else if (listId.includes("RecommendedShows")){
        // // item = recommendedShows[retNum(listId)];
        let temp = [...tvLockToggle];
        temp[retNum(listId)] = !tvLockToggle[retNum(listId)];
        setTvLockToggle(temp);
        // let temp = [...tvToggle.current];
        // temp[retNum(listId)] = !tvToggle.current[retNum(listId)];
        // tvToggle.current = temp;
    }
    

}


return (
    <div className="flex flex-col min-h-screen bg-darker">
        <AIPicksHeader setDisplay={setDisplay} currentDisplay={display} currentUser={currentUser} />
        <button onClick={() => lockToggle( "RecommendedMovies0" )}>Refresh</button>
        <Scrollbar className="w-full overflow-y-auto">
            {display === DISPLAY_MOVIES && (
                contentMovieNone ? (
                    <div className="px-8 py-2 mt-10 text-white text-3xl">
                        Not enough Movies yet. Add some to your favourites or watchlist to get started!
                    </div>
                ) : (
                    movieContentLists.map(list => (
                        <div key={list.listId} className="px-8 py-2">
                            <ContentList list={list} isUserOwned={false} />
                            {/* <button onClick={() => lockToggle( list.listId )}>Refresh</button> */}
                        </div>
                    )


                  
                //     movieContentLists.map(list => movieLockToggle[retNum(list.listId)] == true ? (
                //         <div key={list.listId} className="px-8 py-2">
                //             <ContentList list={list} isUserOwned={false} />
                //             <button onClick={() => lockToggle( list.listId )}>Locked</button>
                //         </div>
                //     ) : (
                //         <div key={list.listId} className="px-8 py-2">
                //             <ContentList list={list} isUserOwned={false} />
                //             <button onClick={() => lockToggle( list.listId )}>Unlocked</button>
                //         </div>
                //     )
                // )
                  
                )
                
            )
            )}
            {display === DISPLAY_SHOWS && (
                contentTVNone ? (
                    <div className="px-8 py-2 mt-10 text-white text-3xl">
                        Not enough TV Shows yet. Add some to your favourites or watchlist to get started!
                    </div>
                ) : (
                    tvContentLists.map(list => (
                        <div key={list.listId} className="px-8 py-2">
                            <ContentList list={list} isUserOwned={false} />
                            {/* <button onClick={() => lockToggle( list.listId )}>Refresh</button> */}
                        </div>
                    )
                )
                    // tvContentLists.map(list => tvLockToggle[retNum(list.listId)] == true ? (
                    //     <div key={list.listId} className="px-8 py-2">
                    //         <ContentList list={list} isUserOwned={false} />
                    //         <button onClick={() => lockToggle( list.listId )}>Locked</button>
                    //     </div>
                    // ) : (
                    //     <div key={list.listId} className="px-8 py-2">
                    //     <ContentList list={list} isUserOwned={false} />
                    //     <button onClick={() => lockToggle( list.listId )}>Unlocked</button>
                    // </div>
                    // )
                    // )
                )
            )}
        </Scrollbar>
    </div>
);
}
