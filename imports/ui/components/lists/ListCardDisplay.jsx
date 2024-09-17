// src/components/ListCardDisplay.jsx

import React from 'react';
import ListCard from './ListCard';

const ListCardDisplay = ({ lists }) => {
  return (
    <div className="flex">
      <div className="w-full px-4 py-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {lists.map((list) => (
            <ListCard key={list._id} list={list} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCardDisplay;
