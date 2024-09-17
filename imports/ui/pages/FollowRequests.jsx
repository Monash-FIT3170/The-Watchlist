import React, { useState, useEffect } from 'react';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import { Meteor } from 'meteor/meteor';
import AllUsersPage from './AllUsersPage';

const FollowRequests = ({ currentUser }) => {
  const [usersList, setUsersList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    if (!currentUser || !currentUser.followerRequests || currentUser.followerRequests.length === 0) {
      setLoading(false);
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
      <div>
        <ProfileDropdown user={currentUser} />
        <div className="text-white text-lg mt-4">You have no follower requests</div>
      </div>
    );
  }

  return (
    <div>
      <ProfileDropdown user={currentUser} />
      <AllUsersPage 
        currentUser={currentUser}
        users={usersList}
      />
    </div>
  );
};

export default FollowRequests;