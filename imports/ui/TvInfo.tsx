import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Rating } from '@mui/material';
import { Rating as RatingDB } from '../db/Rating';
import { useTracker } from 'meteor/react-meteor-data';
import { getImageUrl } from './imageUtils';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const TvInfo = ({ tv, initialLists }) => {
    const [showModal, setShowModal] = useState(false);
    const [lists, setLists] = useState(initialLists);
    const [value, setValue] = useState<number | null>(null);
    const { ratings, isLoading } = useTracker(() => {
        const handler = Meteor.subscribe("rating");
    
        if (!handler.ready()) {
          return { ratings: [], isLoading: true };
        }
    
        const ratings = RatingDB.find({content_type: "Tv", content_id: tv.id}).fetch()
    
        return { ratings: ratings, isLoading: false }
    
      })


    useEffect(() => {
        if (0 < tv.rating && tv.rating < 6) {
            setValue(tv.rating);
            console.log(tv.rating);
        }
    }, [tv.rating]);

    const handleRating = (newValue) => {
        console.log("Rating:", newValue);
    }

    const addRating = (rating) => {
        Meteor.call("rating.create", {content_type: "TV", content_id: tv.id, rating}, (error, result) => {
            if (error) {
                console.error(`Error creating rating: ${error}`);
            } else {
                console.log("Successfully added rating.")
            }
        })
    }

    const { rating, totalRatings, isLoadingRatings } = useTracker(() => {
        const handler = Meteor.subscribe("rating");
    
        if (!handler.ready()) {
          return { rating: [], isLoading: true };
        }
    
        const ratings = RatingDB.find({content_type: "TV", content_id: tv.id}).fetch();

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

    const firstAiredDate = new Date(tv.first_aired).getFullYear();
    const lastAiredDate = tv.last_aired ? new Date(tv.last_aired).getFullYear() : 'Present';

    return (

        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative" style={{ backgroundImage: `url(${getImageUrl(tv.background_url)})`  }}>
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${getImageUrl(tv.background_url)})`, filter: "blur(9px)" }}></div>
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-3/4 rounded-xl shadow-md overflow-hidden md:max-w-4xl bg-black bg-opacity-90 text-white flex flex-row items-center justify-between px-5">
                    <div className="flex flex-col items-start w-2/5 gap-4">
                    <img src={getImageUrl(tv.image_url)} alt={tv.title} className="w-full h-auto rounded-lg mb-5 ml-6" />
                    <div className="grid grid-cols-2 grid-rows-1 gap-1">
                            <Rating
                                name="simple-controlled"
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                    addRating(newValue);
                                }}
                                emptyIcon={<StarBorderIcon fontSize="inherit" color="secondary" />}
                            />
                            <button 
                                className="px-5 py-2 border-none rounded-lg cursor-pointer bg-white text-purple-500 mb-5 ml-6"
                                onClick={() => setShowModal(true)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start w-1/2 h-full overflow-y-auto px-0 py-4">
                        <h1 className="text-6xl font-bold text-center">{tv.title} ({firstAiredDate} - {lastAiredDate})</h1>

                        <p className="text-2xl font-semibold text-center mt-5">Synopsis</p>
                        <p className="text-lg text-center max-w-xl mt-5">{tv.overview}</p>
                        <p className="text-2xl font-semibold text-center mt-5">Genres</p>
                        <div className="text-lg text-center max-w-xl mt-5">
                            {tv.genres.map((genre, index) => (
                                <span key={index} className="mr-2">
                                    {genre}
                                    {index < tv.genres.length - 1 && ','}
                                </span>
                            ))}
                        </div>
                        <p className="text-2xl font-semibold text-center mt-5">RATING</p>
                        <p className="text-lg font-bold text-center mt-5"> {rating ? `${rating}/5 (${totalRatings})` : "Not Yet Rated"}</p>
                        <p className="text-2xl font-semibold text-center mt-5">Seasons</p>
                        <div>
                            {tv.seasons.map((season, index) => (
                                <div key={index} className="mt-5 flex justify-center items-center">
                                    <p className="text-lg font-bold">{`Season ${season.season_number}`}</p>
                                    <button className="ml-2 px-3 py-1 border-none rounded-full cursor-pointer bg-white text-purple-500">+</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} content={tv} type="TV Show" />
        </div>
    );
};

export default TvInfo;
