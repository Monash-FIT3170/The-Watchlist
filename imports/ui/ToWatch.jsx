import React from "react";
import HomeList from './HomeList';

const ToWatch = ({ lists }) => {
  return <HomeList lists={lists} title="To Watch" listType="To Watch" />;
};

export default ToWatch;