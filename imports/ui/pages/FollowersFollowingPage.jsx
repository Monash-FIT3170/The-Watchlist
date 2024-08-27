import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import AllUsersPage from './AllUsersPage';

const FollowersFollowingPage = ( { currentUser } ) => {
  const { userId, type } = useParams(); // Get userId and type (followers/following) from URL parameters
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await new Promise((resolve, reject) => {
          Meteor.call(`users.${type}`, { userId }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });
        setUsersList(users);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    };
    fetchUsers();
  }, [userId, type]);

  return (
    <AllUsersPage 
      currentUser={currentUser}
      users={usersList}
    />
  );
};

export default FollowersFollowingPage;
