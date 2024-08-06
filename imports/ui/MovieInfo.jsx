import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ClickableRatingStar from './ClickableRatingStar';
import { useTracker } from 'meteor/react-meteor-data';
import { Rating as RatingDB } from '../db/Rating';
import { FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


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

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    const { rating, userRating, totalRatings } = useTracker(() => {
        const handler = Meteor.subscribe("rating");
        console.log('Subscription ready:', handler.ready());

        if (!handler.ready()) {
            return { rating: 0, userRating: null, totalRatings: 0, isLoading: true };
        }

        const ratings = RatingDB.find({ contentId: movie.id }).fetch();
        console.log('Fetched ratings:', ratings); // Log the fetched ratings
        const total = ratings.reduce((acc, cur) => acc + cur.rating, 0);
        const averageRating = ratings.length > 0 ? (total / ratings.length).toFixed(2) : 0;
        const userRating = ratings.find(r => r.userId === Meteor.userId())?.rating;

        return {
            rating: averageRating,
            userRating,
            totalRatings: ratings.length
        };
    });



    // this was previously just add rating functionality since we did not deal with users. 
    // here we are checking the existence of a rating so that we can update it if it exists
    const addRating = (userId, contentId, contentType, rating) => {
        console.log('addRating - Received:', { userId, contentId, contentType, rating });
        Meteor.call('ratings.addOrUpdate', { userId, contentId, contentType, rating }, (error, result) => {
            if (error) {
                console.error('Error adding or updating rating:', error);
            } else {
                console.log('Rating updated or added successfully');
            }
        });
    }

    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative " style={{ backgroundImage: `url(${movie.background_url})` }}>
            <div className="absolute inset-0 w-full h-full bg-cover bg-center " style={{ backgroundImage: `url(${movie.background_url})`, filter: "blur(9px)" }}></div>
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
                                    rating={userRating || 0}
                                    onChange={(newValue) => {
                                        console.log('MovieInfo - newRating:', newValue); // Log new rating from ClickableRatingStar
                                        addRating(Meteor.userId(), movie.id, 'Movie', newValue);
                                    }}
                                />


                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-start w-1/2 h-full overflow-y-auto px-0 py-6">
                        <h1 className="text-6xl font-bold text-center w-full">{movie.title} ({movie.release_year})</h1>
                        <div className="flex justify-between items-start w-full mt-5 px-4">
                            <div className="flex flex-col items-center w-1/2">
                                <p className="text-2xl font-semibold">Watchlist Rating</p>
                                <p className="text-lg font-thin flex items-center justify-center mt-2">
                                    <FaStar className="text-yellow-500 mr-1" />
                                    {rating ? `${rating}/5` : "Not Yet Rated"}
                                </p>
                                <p className="text-sm text-gray-400 mt-1">Rated by {totalRatings} users</p>
                            </div>
                            <div className="flex flex-col items-center w-1/2">
                                <p className="text-2xl font-semibold">Your Rating</p>
                                <p className="text-lg font-thin flex items-center justify-center mt-2">
                                    <FaStar className="font-normal text-yellow-500 mr-1" />
                                    {userRating ? `${userRating}/5` : "Not Yet Rated"}
                                </p>
                            </div>
                        </div>
                        <div className="w-full mt-5">
                            <p className="text-2xl font-semibold text-center">Runtime</p>
                            <p className="text-lg font-bold text-center mt-5">{movie.runtime} minutes</p>
                        </div>
                        <div className="w-full mt-5">
                            <p className="text-2xl font-semibold text-center">Synopsis</p>
                            <p className="text-lg text-left max-w-xl mt-5">{movie.overview}</p>
                        </div>
                    </div>
                </div>
                <div className='p-4'>
                    <button
                        onClick={handleBack}
                        className="bg-purple-500 text-white font-bold py-2 px-4 rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                    >
                        Back
                    </button>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} content={movie} type="Movie" />
        </div>
    );
};

export default MovieInfo;
