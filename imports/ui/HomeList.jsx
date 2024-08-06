import React from "react";
import { useNavigate } from 'react-router-dom';
import RatingStar from './RatingStar';
import { useTracker } from 'meteor/react-meteor-data';
import { ListCollection } from '../db/List';
import { Rating as RatingDB } from '../db/Rating';
import { getImageUrl } from "./imageUtils";

const List = ({ list }) => {
    const navigate = useNavigate();

    // Function to handle redirection
    const handleRedirect = (type, id) => {
        navigate(`/${type}${id}`);
    };

    const { allRatings, isLoadingRatings } = useTracker(() => {
        const handler = Meteor.subscribe("rating");

        if (!handler.ready()) {
            return { allRatings: {}, isLoadingRatings: true };
        }

        const ratings = RatingDB.find().fetch();

        if (!ratings.length) {
            return { allRatings: {}, isLoadingRatings: false }
        }

        const ratingReduce = ratings.reduce((acc, currentRating) => {
            if (!(currentRating.contentId in acc)) {
                acc[currentRating.contentId] = {
                    count: 0,
                    totalRatings: 0
                };
            }

            acc[currentRating.contentId]["count"] += 1;
            acc[currentRating.contentId]["totalRatings"] += currentRating.rating;
            return acc;
        }, {});

        for (const id in ratingReduce) {
            ratingReduce[id]["finalRating"] = (ratingReduce[id]["totalRatings"] / ratingReduce[id]["count"]).toFixed(2);
        }

        return { allRatings: ratingReduce, isLoadingRatings: false };
    });

    return (
        <div key={list._id} className="space-y-8">
            {list.content.map((item) => (
                <div key={item.contentId} className="relative" onClick={() => handleRedirect(item.type, item.contentId)}>
                    <div className="relative rounded-lg shadow-lg cursor-pointer overflow-visible">
                        <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                            <img
                                src={getImageUrl(item.background_url)}
                                alt={item.title}
                                className="w-full h-35vh object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-sm">{item.description}</p>
                                    {isLoadingRatings ? null : <RatingStar totalStars={5} rating={(item.contentId in allRatings) ? allRatings[item.contentId].finalRating : 0} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const HomeList = ({ title, listType }) => {
    const navigate = useNavigate();

    // Subscribe to and fetch the lists from the database
    const { lists, loading } = useTracker(() => {
        const userId = Meteor.userId(); // Get the current user's ID
        const listsHandle = Meteor.subscribe('userLists', userId);
        const lists = ListCollection.find({ userId, listType }).fetch(); // Filter by userId and listType
        const loading = !listsHandle.ready();
        return { lists, loading };
    }, [listType]);

    // Check if all lists have empty content
    const isEmpty = lists.every(list => list.content.length === 0);

    return (
        <div className="w-full h-full px-5 py-5 rounded-lg flex flex-col items-left shadow-xl overflow-auto scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-thin">
            <h1 className="font-sans font-bold text-4xl my-4 mt-0 mb-4">{title}</h1>
            {loading ? (
                <div>Fetching your Content Lists...</div> // Display loading message
            ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center flex-grow">
                    <p className="text-lg text-white mb-4">You don't have any items in this list yet.</p>
                    <button 
                        className="px-6 py-2 bg-magenta text-white rounded hover:bg-pink-700 transition-colors"
                        onClick={() => navigate('/search')}
                    >
                        Find great movies and shows
                    </button>
                </div>
            ) : (
                <div className="w-full overflow-visible">
                    {lists.map((list) => <List key={list._id} list={list} />)}
                </div>
            )}
        </div>
    );
};

export default HomeList;
