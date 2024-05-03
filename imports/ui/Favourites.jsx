import React from "react";
import './Home.css';
import dummyMovies from './DummyMovies';
import RatingStar from './RatingStar';

const Favourites = () => {
  const favourites = dummyMovies.filter(list => list.listType === 'Favourite');

  return (
    <div className="favourites">
      <h1>Favourites</h1>
      {favourites.map((list) => (
        <div key={list.listId}>
          <div className="movie-list">
            {list.content.map((item) => (
              <div key={item.id} className="movie-item">
                <img src={item.image_url} alt={item.title} style={{ width: '100px', borderRadius: '10px' }} />
                <div className="movie-text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <RatingStar totalStars={5}  rating={item.rating}  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Favourites;