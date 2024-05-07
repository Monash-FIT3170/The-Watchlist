import React from "react";
import RatingStar from './RatingStar';

const List = ({ list }) => {
  return (
    <div key={list.listId}>
      {list.content.map((item) => (
        <div key={item.id} className="flex items-center mb-12 text-light">
          <img src={item.image_url} alt={item.title} className="w-24 rounded-lg mr-5" />
          <div className="ml-5">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <RatingStar totalStars={5}  rating={item.rating}  />
          </div>
        </div>
      ))}
    </div>
  );
};

const ToWatch = ({ dummyMovies }) => {
  const toWatchList = dummyMovies.filter(list => list.listType === 'To Watch');

  return (
    <div className="to-watch w-full mx-5 my-5 rounded-lg flex flex-col items-center overflow-y-auto">
      <hr className="w-full" />
      <h1 className="font-bold text-4xl my-4">To Watch</h1>
      <hr className="w-full" />
      {toWatchList.map((list) => <List list={list} />)}
    </div>
  );
};

export default ToWatch;