import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import ClickableRatingStar from "./ClickableRatingStar";
import { useTracker } from "meteor/react-meteor-data";
import { Rating as RatingDB } from "../db/Rating";
import { getImageUrl } from "./imageUtils";

const TvInfo = ({ tv, initialLists }) => {
  const [showModal, setShowModal] = useState(false);
  const [lists, setLists] = useState(initialLists);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    if (0 < tv.rating && tv.rating < 6) {
      setValue(tv.rating);
      console.log(tv.rating);
    }
  }, [tv.rating]);

  const handleRating = (newValue) => {
    console.log("Rating:", newValue);
  };

  const { rating, userRating, totalRatings } = useTracker(() => {
    const handler = Meteor.subscribe("rating");
    console.log('Subscription ready:', handler.ready());

    if (!handler.ready()) {
      return { rating: 0, userRating: null, totalRatings: 0, isLoading: true };
    }

    const ratings = RatingDB.find({ contentId: tv.id }).fetch();
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

  const firstAiredDate = new Date(tv.first_aired).getFullYear();
  const lastAiredDate = tv.last_aired
    ? new Date(tv.last_aired).getFullYear()
    : "Present";

  return (
    <div
      className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative"
      style={{ backgroundImage: `url(${getImageUrl(tv.background_url)})` }}
    >
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center "
        style={{
          backgroundImage: `url(${getImageUrl(tv.background_url)})`,
          filter: "blur(9px)",
        }}
      ></div>
      <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
        <div className="w-full h-3/4 rounded-xl shadow-md overflow-hidden md:max-w-4xl bg-darker bg-opacity-90 text-white flex flex-row items-center justify-between px-5">
          <div className="flex flex-col items-start w-2/5 gap-4 ">
            <img
              src={getImageUrl(tv.image_url)}
              alt={tv.title}
              className="w-full  rounded-lg mb-5 ml-6 h-[60vh]"
            />
            <div className="grid grid-cols-2 grid-rows-1 -mt-5">
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
                    addRating(Meteor.userId(), tv.id, 'TV', newValue);
                  }}
                />


              </div>
            </div>
          </div>
          <div className="flex flex-col items-start w-1/2 h-full overflow-y-auto px-0 py-4">
            <h1 className="text-6xl font-bold text-center">
              {tv.title} ({firstAiredDate} - {lastAiredDate})
            </h1>

            <p className="text-2xl font-semibold text-center mt-5">Synopsis</p>
            <p className="text-lg text-left max-w-xl mt-5">{tv.overview}</p>
            <p className="text-2xl font-semibold text-left mt-5">Genres</p>
            <div className="text-lg text-center max-w-xl mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {tv.genres.map((genre, index) => (
                <div key={index} className="mb-2">
                  {genre}
                </div>
              ))}
            </div>
            <p className="text-2xl font-semibold text-center mt-5">RATING</p>
            <p className="text-lg font-bold text-center mt-5">
              {" "}
              {rating ? `${rating}/5 (${totalRatings})` : "Not Yet Rated"}
            </p>
            <p className="text-2xl font-semibold text-center mt-5">Seasons</p>
            <div>
              {tv.seasons.map((season, index) => (
                <div
                  key={index}
                  className="mt-5 flex justify-center items-center"
                >
                  <p className="text-lg font-bold">{`Season ${season.season_number}`}</p>
                  <button className="ml-2 px-3 py-1 border-none rounded-full cursor-pointer bg-magenta text-white">
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        content={tv}
        type="TV Show"
      />
    </div>
  );
};

export default TvInfo;
