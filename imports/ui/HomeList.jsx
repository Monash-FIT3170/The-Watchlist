import React from "react";
import { useNavigate } from 'react-router-dom';
import RatingStar from './RatingStar';
import { useLists } from './ListContext'; // Import the context
import { getImageUrl } from "./imageUtils";
import { useTracker } from 'meteor/react-meteor-data';
import { Rating as RatingDB } from '../db/Rating';
import Scrollbar from "./ScrollBar";

const List = ({ list }) => {
    const navigate = useNavigate();

    // Function to handle redirection
    const handleRedirect = (type, id) => {
        navigate(`/${type}${id}`);
    };

    const { allRatings, isLoadingRatings } = useTracker(() => {
        const handler = Meteor.subscribe("rating");

        if (!handler.ready()) {
            return { allRatings: {}, isLoading: true };
        }

        const ratings = RatingDB.find().fetch();

        if (!ratings.length) {
            return { allRatings: {}, isLoadingRatings: false }
        }

        const ratingReduce = ratings.reduce((acc, currentRating) => {
            if (!(currentRating.content_id in acc)) {
                acc[currentRating.content_id] = {
                    count: 0,
                    totalRatings: 0
                }
            }

            acc[currentRating.content_id]["count"] += 1;
            acc[currentRating.content_id]["totalRatings"] += currentRating.rating;
            return acc;
        }, {});

        for (const id in ratingReduce) {
            ratingReduce[id]["finalRating"] = (ratingReduce[id]["totalRatings"] / ratingReduce[id]["count"]).toFixed(2);
        }

        return { allRatings: ratingReduce, isLoadingRatings: false }
    });

    return (
        <div key={list._id} className="space-y-8">
            {list.content.map((item) => (
                <div key={item.content_id} className="relative" onClick={() => handleRedirect(item.type, item.content_id)}>
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
                                    {isLoadingRatings ? null : <RatingStar totalStars={5} rating={(item.content_id in allRatings) ? allRatings[item.content_id].finalRating : 0} />}
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
    const { lists } = useLists();
    const filteredMovies = lists.filter(list => list.listType === listType);

    return (
        <div>
            <h1 className="font-sans font-bold text-4xl my-4 mt-0 mb-4">{title}</h1>
            <Scrollbar className="w-full h-full px-5 py-5 rounded-lg flex flex-col items-left">
                <div className="w-full">
                    {filteredMovies.map((list) => <List key={list._id} list={list} />)}
                </div>
            </Scrollbar>
        </div>
    );
};

export default HomeList;