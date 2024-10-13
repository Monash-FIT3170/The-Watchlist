import React, { useState, useEffect } from 'react';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import { Meteor } from 'meteor/meteor';
import FollowRequestDisplay from './FollowRequestDisplay';
import { ImCrying } from "react-icons/im";

const FollowRequests = ({ currentUser }) => {
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!currentUser || !currentUser.followerRequests || currentUser.followerRequests.length === 0) {
      return;
    }


    const fetchUsers = async () => {
      try {
        const users = await new Promise((resolve, reject) => {
          Meteor.call('users.followerRequests', { userId: currentUser._id }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
        setUsersList(users);
      } catch (error) {
        console.error('Error fetching follower requests:', error);
        setError('Failed to fetch follower requests');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser]);



  if (error) {
    return <div>{error}</div>; // Display error message if there's an issue
  }

  if (currentUser.followerRequests.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-darker">
        <div className="flex flex-col justify-end items-start w-full h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
          <h1 className="text-7xl text-white font-bold mb-2">Follow Requests</h1>
          <div className="absolute top-4 right-4">
            <ProfileDropdown user={currentUser} />
          </div>
        </div>
        <div className="mt-36">
          <h2 className="text-white text-center text-5xl mt-4 font-bold">You have no follower requests</h2>
          <div className="flex justify-center items-center h-full mt-10">
            <ImCrying className="text-gray-500 text-9xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-darker">
      <div className="flex flex-col justify-end items-start w-full h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
        <h1 className="text-7xl text-white font-bold mb-2">Follow Requests</h1>
      </div>
      <FollowRequestDisplay
        currentUser={currentUser}
        users={usersList}
      />
    </div>
  );
};

export default FollowRequests;