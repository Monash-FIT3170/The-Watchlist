import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './MovieList.css';

const MovieList = ({ title, images }) => {

  //error handling here to ensure 5 images are always being passed
  // 'proptypes' to check?





  //this will redirect to the page allowing us to
  //see the entire list of movies
  //(or should we handle this differently)
  let navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/profile'); //example redirect to profile page, but will be to larger list page
  };
  

  return (
    <div className="movielist-container">
      <div className="movielist-header">
        <h1>{title}</h1>
        
        <button onClick={handleRedirect} className="plus-button">+</button>
      </div>
      <div className="movielist-content">
        {/* {images.map((image, index) => (
          <img key={index} src={image.src} alt={image.alt} className="movielist-image" />
        ))} */}
        hello
      </div>
    </div>
  );
};
export default MovieList;