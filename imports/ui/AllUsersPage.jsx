import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown';
import { AiOutlineSearch } from 'react-icons/ai';
import { handleFollow, handleUnfollow } from '/imports/api/userMethods';

const AllUsersPage = ({ users: propUsers, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = Meteor.userId();
  
  // State for search term, sorting option, and dropdown visibility
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('alphabetical'); // Default sort option
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Helper function to check if the current user is following another user
  const isFollowing = (userId) => {
    return currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(userId);
  };

  // Handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Get the list of users from props or location state
  const users = propUsers || location.state?.users || [];

  // Sorting function based on selected option
  const sortUsers = (users, option) => {
    const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchTerm));
    if (option === 'alphabetical') {
      return [...filteredUsers].sort((a, b) => {
        const nameA = a.username || ''; // Fallback to an empty string if name is undefined
        const nameB = b.username || ''; // Fallback to an empty string if name is undefined
        return nameA.localeCompare(nameB);
      });
    } else if (option === 'percentage') {
      return [...filteredUsers].sort((a, b) => b.percentageMatch - a.percentageMatch);
    }
    return filteredUsers;
  };

  // Get the sorted list of users
  const sortedUsersList = sortUsers(users, sortOption);

  useEffect(() => {
    console.log('AllUsersPage loaded with users:', users);
  }, [users]);

  return (
    <div className="bg-darker min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex flex-col items-left w-full">
        <div className="flex items-left justify-start mb-4 space-x-7 w-full max-w-xl mt-1 ml-0">
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
          {/* Sorting Dropdown */}
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
        <Scrollbar className="w-full">
          <div className="flex flex-wrap justify-start items-start gap-8 p-4">
            {sortedUsersList.map((user, index) => (
              <div
                key={index}
                className="min-w-[200px] max-w-[200px] flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                onClick={() => navigate(`/user/${user._id}`)}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <img src={user.avatarUrl || './default-avatar.png'} alt={user.username} className="w-full h-auto rounded-full" />
                  <p className="text-white mt-2 text-xl text-center">{user.username}</p>
                </div>
                {currentUserId !== user._id && (
                  <button
                    className={`mt-2 px-4 py-1 ${isFollowing(user._id) ? 'bg-blue-600' : 'bg-fuchsia-600'} text-white rounded-full`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFollowing(user._id)) {
                        handleUnfollow(user._id);
                      } else {
                        handleFollow(user._id);
                      }
                    }}
                  >
                    {isFollowing(user._id) ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default AllUsersPage;
