import React from "react";
import RatingStar from './RatingStar';

const List = ({ list }) => {
  return (
    <div key={list.listId} className="bg-white rounded-lg p-5 shadow-md overflow-auto">
      {list.content.map((item) => (
        <div key={item.id} className="flex items-center mb-5 text-black">
          <img src={item.image_url} alt={item.title} className="w-24 rounded-lg mr-5" />
          <div className="ml-5">
            <h3 className="text-black">{item.title}</h3>
            <p className="text-gray-500">{item.description}</p>
            <RatingStar totalStars={5}  rating={item.rating}  />
          </div>
        </div>
      ))}
    </div>
  );
};

const Favourites = ({ dummyMovies }) => {
  const favourites = dummyMovies.filter(list => list.listType === 'Favourite');

  return (
    <div className="favourites w-3/5 mx-5">
      <h1 className="font-bold text-4xl">Favourites</h1>
      {favourites.map((list) => <List list={list} />)}
    </div>
  );
};

export default Favourites;