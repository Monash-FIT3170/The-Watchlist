// imports/ui/FollowersFollowingPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import UserList from './UserList';

const FollowersFollowingPage = () => {
  const { userId, type } = useParams(); // Get userId and type (followers/following) from URL parameters
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    <div className="user-discovery text-center">
      <UserList
        heading={type.charAt(0).toUpperCase() + type.slice(1)}
        users={usersList}
        searchTerm={searchTerm}
        onFollow={(userId) => {
          Meteor.call('followUser', userId, (error) => {
            if (error) {
              console.error('Error following user:', error);
            } else {
              console.log('Followed user successfully');
            }
          });
        }}
        onUnfollow={(userId) => {
          Meteor.call('unfollowUser', userId, (error) => {
            if (error) {
              console.error('Error unfollowing user:', error);
            } else {
              console.log('Unfollowed user successfully');
            }
          });
        }}
      />
    </div>
  );
};

export default FollowersFollowingPage;
