import React from 'react';
import { Link } from 'react-router-dom';

const UserList = ({ heading, users, searchTerm }) => {
  const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return (
    <div className="bg-darker p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-semibold">{heading}</h2>
        <a href="#" className="text-sm text-blue-400">View All</a>
      </div>
      <div className="grid grid-cols-6 gap-8">
        {filteredUsers.map((user, index) => (
          <div key={index} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <Link
              to={`/profile/${filteredUsers.name}`}
              className="flex flex-col items-center"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-auto rounded-full aspect-square"
              />
              <p className="text-white mt-2 text-xl text-center">{user.name}</p>
            </Link>
            <button className="mt-2 px-4 py-1 bg-fuchsia-600 text-white rounded-full">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Default props for testing
UserList.defaultProps = {
  heading: 'Popular Users',
  users: Array(6).fill({
    avatar: './ExampleResources/user-avatar.jpg',
    name: 'BabRulez',
  }),
  searchTerm: '',
};

export default UserList;
