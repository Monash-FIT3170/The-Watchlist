import React from "react";
import HomeList from './HomeList';

const Favourites = ({ lists }) => {
  return <HomeList lists={lists} title="Favourites" listType="Favourite" />;
};

export default Favourites;