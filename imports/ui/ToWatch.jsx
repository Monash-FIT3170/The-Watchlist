import React from "react";

const ToWatch = ({ toWatchList }) => {
  const movies = toWatchList.length > 0 ? toWatchList : [
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
    <div className="to-watch">
      <h1>To Watch</h1>
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

export default ToWatch;