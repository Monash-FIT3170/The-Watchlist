import React from "react";
import RatingStar from './RatingStar';

const List = ({ list }) => {
  return (
    <div key={list.listId} className="space-y-8">
      {list.content.map((item) => (
        <div key={item.id} className="relative group">
          <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover rounded-lg shadow-lg" />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-lg">
            <div className="text-white">
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-sm">{item.description}</p>
              <RatingStar totalStars={5} rating={item.rating} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MovieList = ({ dummyMovies, title, listType }) => {
  const filteredMovies = dummyMovies.filter(list => list.listType === listType);

  return (
    <div className="w-full px-5 py-5 rounded-lg flex flex-col items-left shadow-xl">
      <h1 className="font-sans font-bold text-4xl my-4 mt-0 mb-4">{title}</h1>
      <div className="w-full overflow-y-auto scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-thin">
        {filteredMovies.map((list) => <List list={list} />)}
      </div>
    </div>
  );
};

export default MovieList;
