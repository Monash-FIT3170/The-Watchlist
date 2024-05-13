import React from "react";
import HomeList from './HomeList';

const ToWatch = ({ dummyMovies }) => {
  return <HomeList dummyMovies={dummyMovies} title="To Watch" listType="To Watch" />;
};

export default ToWatch;