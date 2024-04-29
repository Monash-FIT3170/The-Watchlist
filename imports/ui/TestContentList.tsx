import React from 'react';
import ContentList from './ContentList' 

const TestContentList = () => {
  const title = "My Favorite Shows";
  const images = [
    { src: './ExampleResources/sienfeld.jpg', alt: 'Seinfeld' },
    { src: './ExampleResources/friends.jpg', alt: 'Friends' },
    { src: './ExampleResources/007.jpg', alt: '007' },
    { src: './ExampleResources/planet-earth.jpeg', alt: 'Planet Earth' },
    { src: './ExampleResources/fresh-prince.jpg', alt: 'Fresh Prince' }
  ];

  return (
    <ContentList title={title} images={images} />
  );
};

export default TestContentList;