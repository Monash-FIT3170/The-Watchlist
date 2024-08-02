import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AllUsersPage from './AllUsersPage';

const FollowersFollowingPage = ({ currentUser }) => {
  const { userId, type } = useParams(); 
  const [usersList, setUsersList] = useState([]);
  const [sortOption, setSortOption] = useState('alphabetical'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts or when userId/type changes
  }, [userId, type]);

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

  const handleFollow = (userId) => {
    Meteor.call('followUser', userId, (error) => {
      if (error) {
        console.error('Error following user:', error);
      } else {
        fetchUsers(); // Re-fetch the updated users list after following
      }
    });
  };

  const handleUnfollow = (userId) => {
    Meteor.call('unfollowUser', userId, (error) => {
      if (error) {
        console.error('Error unfollowing user:', error);
      } else {
        fetchUsers(); // Re-fetch the updated users list after unfollowing
      }
    });
  };

  const sortUsers = (users, option) => {
    if (option === 'alphabetical') {
      return [...users].sort((a, b) => {
        const nameA = a.name || ''; // Fallback to an empty string if name is undefined
        const nameB = b.name || ''; // Fallback to an empty string if name is undefined
        return nameA.localeCompare(nameB);
      });
    } else if (option === 'percentage') {
      return [...users].sort((a, b) => b.percentageMatch - a.percentageMatch);
    }
    return users;
  };

  const sortedUsersList = sortUsers(usersList, sortOption);

  return (
    <div className="relative">
      <div className="bg-darker rounded-lg flex justify-between items-center h-16 px-4">
        <div className="flex-grow text-center">
          <h1 className="text-5xl font-semibold">
            {type === 'followers' ? 'Followers' : 'Following'}
          </h1>
        </div>
        <div className="relative border border-solid rounded-full px-4 py-2 focus:bg-magenta">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className="text-sm text-white"
          >
            Sort by
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-darkest rounded-lg shadow-lg z-50">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => { setSortOption('alphabetical'); setIsDropdownOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Alphabetical Order
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setSortOption('percentage'); setIsDropdownOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    Percentage Match
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        {/* Conditionally render AllUsersPage based on the users list */}
        {sortedUsersList.length > 0 ? (
          <AllUsersPage 
            currentUser={currentUser}
            users={sortedUsersList}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        ) : (
          <div>No users to display</div>
        )}
      </div>
    </div>
  );
};

export default FollowersFollowingPage;
