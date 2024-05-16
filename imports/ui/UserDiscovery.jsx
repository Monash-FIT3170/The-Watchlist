import React from 'react';
import UserList from './UserList';

const UserDiscovery = () => {
  return (
    <div className="user-discovery text-center ">
      <h1 className="text-white text-3xl p-8 mb-6 bg-darker rounded-lg shadow-md">User Discovery</h1>
      <div >
        <UserList heading="Popular Users" />
        <div className="mt-8">
          <UserList heading="Similar Users" />
        </div>
      </div>
    </div>
  );
};

export default UserDiscovery;
