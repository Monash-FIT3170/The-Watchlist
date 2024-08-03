import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { RatingCollection } from '../db/Rating';

const UserRatingsPage = () => {
  const { userId } = useParams();
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    Meteor.subscribe('userRatings', userId);
    const fetchedRatings = RatingCollection.find({ userId }).fetch();
    setRatings(fetchedRatings);
  }, [userId]);

  return (
    <div>
      <h1>{userId}'s Ratings</h1>
      {ratings.map((rating) => (
        <div key={rating._id}>
          <p>{rating.contentType} - ID: {rating.contentId} - Rating: {rating.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default UserRatingsPage;
