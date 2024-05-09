import React from 'react';
import MovieList from './MovieList.jsx';

export const AIPicks = () => {

    //example images
    //in the future, these images should be pulled
    //by the api depending on the movie the ai has picked
    const images = [
        { src: './ExampleResources/sienfeld.jpg', alt: 'Seinfeld' },
        { src: './ExampleResources/friends.jpg', alt: 'Friends' },
        { src: './ExampleResources/007.jpg', alt: '007' },
        { src: './ExampleResources/planet-earth.jpeg', alt: 'Planet Earth' },
        { src: './ExampleResources/fresh-prince.jpg', alt: 'Fresh Prince' }
      ];
        //example titles
      const title_example1 = "Based on Watch History";
      const title_example2 = "Based on Genre Preferences";



    return ( 
        <div className="aipicks">
            <h1> AI Picks </h1>
            <MovieList title={title_example1} images={images} />
            <MovieList title={title_example2} images={images} />
        </div>
     );
};