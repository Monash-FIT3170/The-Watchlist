import React from "react";
import './HomePage.css'

const Favourites = ({ favourites }) => {
  const movies = favourites.length > 0 ? favourites : [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "Dummy Movie 1",
      description: "This is a dummy movie description.",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "Dummy Movie 2",
      description: "This is another dummy movie description.",
    },
  ];

  return (
    <div className="favourites">
      <h1>Favourites</h1>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-item">
            <img src={movie.image} alt={movie.title} />
            <div>
              <h3>{movie.title}</h3>
              <p>{movie.description}</p>
              <div className="rating">{/* Render rating stars here */}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;