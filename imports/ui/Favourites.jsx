import React from "react";
import HomeList from './HomeList';

const Favourites = ({ dummyMovies }) => {
  return <HomeList dummyMovies={dummyMovies} title="Favourites" listType="Favourite" />;
};

export default Favourites;