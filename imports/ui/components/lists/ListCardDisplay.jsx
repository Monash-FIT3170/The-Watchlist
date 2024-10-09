// src/components/ListCardDisplay.jsx

import React from 'react';
import ListCard from './ListCard';

const ListCardDisplay = ({ lists }) => {
  return (
    <div className="flex">
      <div className="w-full">
      <div
                    className="grid gap-6"
                    style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    }}
                >
          {lists.map((list) => (
            <ListCard key={list._id} list={list} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListCardDisplay;
