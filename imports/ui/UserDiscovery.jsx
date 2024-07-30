import React, { useState } from 'react';
import UserList from './UserList';
import { AiOutlineSearch } from 'react-icons/ai';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

const UserDiscovery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const users = useTracker(() => {
    Meteor.subscribe('allUsers');
    return Meteor.users.find().fetch();
  });

  const [selectedUser, setSelectedUser] = useState(null);

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFollow = (userId) => {
    Meteor.call('followUser', userId, (error, result) => {
      if (error) {
        console.error('Error following user:', error);
      } else {
        console.log('Followed user successfully');
      }
    });
  };

  const handleUnfollow = (userId) => {
    Meteor.call('unfollowUser', userId, (error, result) => {
      if (error) {
        console.error('Error unfollowing user:', error);
      } else {
        console.log('Unfollowed user successfully');
      }
    });
  };

  return (
    <div className="user-discovery text-center">
      <div className="flex items-center justify-start mb-8 space-x-7 w-full max-w-xl mt-4 ml-1">
        <div className="relative flex-grow">
          <input
            type="text"
            className="rounded-full bg-dark border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <AiOutlineSearch className="text-gray-400" size={20} />
          </span>
        </div>
      </div>
      <div>
        <UserList heading="Popular Users" users={users} searchTerm={searchTerm} onFollow={handleFollow} onUnfollow={handleUnfollow} onSelectUser={selectUser} />
        <div className="mt-8">
          <UserList heading="Similar Users" users={users} searchTerm={searchTerm} onFollow={handleFollow} onUnfollow={handleUnfollow} onSelectUser={selectUser} />
        </div>
      </div>
    </div>
  );
};

export default UserDiscovery;
