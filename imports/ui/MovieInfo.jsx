import React, { useState, useEffect } from 'react';
import Modal from './Modal'; 
import ClickableRatingStar from './ClickableRatingStar';
import { useTracker } from 'meteor/react-meteor-data';
import { Rating as RatingDB } from '../db/Rating';


const MovieInfo = ({ movie, initialLists }) => { 
    const [showModal, setShowModal] = useState(false);
    const [lists, setLists] = useState(initialLists);
    const [value, setValue] = useState(null);

    useEffect(() => {
        if (0 < movie.rating && movie.rating < 6) {
            setValue(movie.rating);
            console.log(movie.rating);
        }
    }, [movie.rating]);

    const handleRating = (newValue) => {
        console.log(movie);
        movie.rating = newValue;

    }

    const { rating, totalRatings, isLoadingRatings } = useTracker(() => {
        const handler = Meteor.subscribe("rating");
    
        if (!handler.ready()) {
          return { rating: [], isLoading: true };
        }
    
        const ratings = RatingDB.find({content_type: "Movie", content_id: movie.id}).fetch();

        if (!ratings.length) {
            return { rating: null, totalRatings: null, isLoadingRatings: false }
        }

        console.log(ratings);

        const ratingReduce = ratings.reduce((acc, currentRating) => {
            acc["count"] += 1;
            acc["totalRatings"] += currentRating.rating;
            return acc;
        }, {count: 0, totalRatings: 0});

        const finalRating = (ratingReduce["totalRatings"] / ratingReduce["count"]).toFixed(2);

        console.log(finalRating);

        return { rating: finalRating, totalRatings: ratingReduce["count"], isLoadingRatings: false }
    
    });


    const addRating = (rating) => {
        Meteor.call("rating.create", {content_type: "Movie", content_id: movie.id, rating}, (error, result) => {
            if (error) {
                console.error(`Error creating rating: ${err}`);
            } else {
                console.log("Successfully added rating.")
            }
        })
    }


    const handleAddContent = (listId, content) => {
        const userId = 1; // Temporary userId: 1
        
        Meteor.call('list.addContent', { listId, userId, content }, (error, result) => {
            if (error) {
                console.error("Error adding content to list:", error);
            } else {
                console.log("Content added to list successfully:", result);
                
                // Update the state with the new content
                setLists(lists.map(list => {
                    if (list._id === listId) {
                        return {
                            ...list,
                            content: [...list.content, content]
                        };
                    }
                    return list;
                }));
                setShowModal(false);
            }
        });
    };
    
    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative" style={{ backgroundImage: `url(${movie.background_url})` }}>
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${movie.background_url})`, filter: "blur(9px)"}}></div>
            {console.log(movie.background_url)}
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-3/4 rounded-xl shadow-md overflow-hidden md:max-w-4xl bg-black bg-opacity-90 text-white flex flex-row items-center justify-between px-5">
                    <div className="flex flex-col items-start w-2/5 gap-4">
                        <img src={movie.image_url} alt={movie.title} className="w-full h-[60vh] rounded-lg mb-5 ml-6" />
                        <div className="grid grid-cols-2 grid-rows-1 gap -mt-6">
                        <div className="">
                <button
                  className=" ml-5 p-0 w-12 h-12 bg-magenta rounded-full hover:bg-dark-magenta active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"
                  onClick={() => setShowModal(true)}
                >
                  <svg
                    viewBox="0 0 20 20"
                    enable-background="new 0 0 20 20"
                    className="w-6 h-6 inline-block"
                  >
                    <path
                      fill="#FFFFFF"
                      d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                                    C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                                    C15.952,9,16,9.447,16,10z"
                    />
                  </svg>
                </button>
              </div>

                        <div className="mt-2 -ml-9">
                <ClickableRatingStar
                  totalStars={5}
                  rating={value !== null ? value : 0}
                  onChange={(newValue) => {
                    setValue(newValue);
                    addRating(newValue);
                  }}
                />
              </div>
              </div>
          </div>
                    <div className="flex flex-col items-start w-1/2 h-full overflow-y-auto px-0 py-4">
                        <h1 className="text-6xl font-bold text-center">{movie.title} ({movie.release_year})</h1>
                        <p className="text-2xl font-semibold text-center mt-5">SYNOPSIS</p>
                        <p className="text-lg text-left max-w-xl mt-5">{movie.overview}</p>
                        <p className="text-2xl font-semibold text-center mt-5">RUNTIME</p>
                        <p className="text-lg font-bold text-center mt-5"> {movie.runtime}</p>
                        <p className="text-2xl font-semibold text-center mt-5">RATING</p>
                        <p className="text-lg font-bold text-center mt-5"> {rating ? `${rating}/5 (${totalRatings})` : "Not Yet Rated"}</p>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} content={movie} type="Movie" />
        </div>
    );
};

export default MovieInfo;
