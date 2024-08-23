import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import { AiOutlineSearch } from 'react-icons/ai';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import ProfileDropdown from './ProfileDropdown';

const UserDiscovery = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const users = useTracker(() => {
    Meteor.subscribe('allUsers');
    return Meteor.users.find().fetch();
  });

  useEffect(() => {
    console.log("UserDiscovery component mounted or updated");
  });
  
  const [selectedUser, setSelectedUser] = useState(null);

  const selectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="bg-darker min-h-screen p-4">
            <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex items-center justify-start mb-8 space-x-7 w-full max-w-xl mt-1 ml-0">
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
        <UserList heading="Similar Users" users={users} searchTerm={searchTerm} onSelectUser={selectUser} />
      </div>
    </div>
  );
};

export default UserDiscovery;
