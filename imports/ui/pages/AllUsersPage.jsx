// imports/ui/pages/AllUsersPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import { AiOutlineSearch } from 'react-icons/ai';
import { useTracker } from 'meteor/react-meteor-data';

const AllUsersPage = ({ users: propUsers, currentUser }) => {
  const navigate = useNavigate();
  const currentUserId = Meteor.userId();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('recentlyAdded'); // Default sort option

  // Adjusted isFollowing function
  const isFollowing = (userId) => {
    return (
      currentUser &&
      Array.isArray(currentUser.following) &&
      currentUser.following.some((f) => f.userId === userId)
    );
  };

  const isRequested = (userId) => {
    return (
      currentUser.followingRequests &&
      currentUser.followingRequests.includes(userId)
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Fetch users from the publication
  const { users: fetchedUsers, isLoading } = useTracker(() => {
    if (propUsers && propUsers.length > 0) {
      // When propUsers is provided, use it and avoid the subscription
      return { users: propUsers, isLoading: false };
    } else {
      const subscription = Meteor.subscribe('allUsers', currentUserId);

      const fetched = Meteor.users.find(
        {},
        {
          fields: {
            username: 1,
            avatarUrl: 1,
            createdAt: 1,
            'following.userId': 1,
            'following.followedAt': 1,
          },
        }
      ).fetch();

      return {
        isLoading: !subscription.ready(),
        users: fetched,
      };
    }
  }, [currentUserId]); // Removed propUsers from dependencies

  // Use propUsers if provided, else use fetchedUsers
  const users = propUsers && propUsers.length > 0 ? propUsers : fetchedUsers;

  // Memoize updatedUsers
  const updatedUsers = useMemo(() => {
    return users.map((user) => {
      const followingObj =
        currentUser.following &&
        currentUser.following.find((f) => f.userId === user._id);
      return {
        ...user,
        followedAt: followingObj ? followingObj.followedAt : user.createdAt,
      };
    });
  }, [users, currentUser]);

  // Memoize filteredUsers
  const filteredUsers = useMemo(() => {
    return updatedUsers.filter((user) =>
      user.username.toLowerCase().includes(searchTerm)
    );
  }, [updatedUsers, searchTerm]);

  // Sorting function based on selected option
  const sortUsers = (users, option) => {
    if (option === 'alphabetical') {
      return [...users].sort((a, b) => {
        const nameA = (a.username || '').toLowerCase();
        const nameB = (b.username || '').toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } else if (option === 'recentlyAdded') {
      return [...users].sort((a, b) => {
        const dateA = a.followedAt ? new Date(a.followedAt) : new Date(0);
        const dateB = b.followedAt ? new Date(b.followedAt) : new Date(0);
        return dateB - dateA; // Sort by followedAt in descending order
      });
    }
    return users;
  };

  // Memoize sortedUsersList
  const sortedUsersList = useMemo(() => {
    return sortUsers(filteredUsers, sortOption);
  }, [filteredUsers, sortOption]);

  useEffect(() => {
    console.log('AllUsersPage loaded with users:', users);
  }, [users]);

  if (isLoading && (!propUsers || propUsers.length === 0)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-darker min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex flex-col items-left w-full">
        {/* Search Bar */}
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
        </div>

        {/* Sorting Dropdown */}
        <div className="relative mb-4">
          <select
            id="sort-select"
            name="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="block w-50 bg-dark text-white py-2 pl-3 pr-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5a0e3c] focus:border-transparent"
          >
            <option value="recentlyAdded">Recently Added</option>
            <option value="alphabetical">Alphabetical Order</option>
          </select>
        </div>

        {/* Users List */}
        <Scrollbar className="w-full">
          <div className="flex flex-wrap justify-start items-start gap-8 p-4">
            {sortedUsersList.map((user) => (
              <div
                key={user._id} // Use unique key
                className="min-w-[200px] max-w-[200px] flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                onClick={() => navigate(`/user/${user._id}`)}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <img
                    src={user.avatarUrl || './default-avatar.png'}
                    alt={user.username}
                    className="w-full h-auto rounded-full"
                  />
                  <p className="text-white mt-2 text-xl text-center">
                    {user.username}
                  </p>
                </div>
                {currentUserId !== user._id && (
                  <button
                    className={`mt-2 px-4 py-1 ${
                      isFollowing(user._id)
                        ? 'bg-blue-600'
                        : isRequested(user._id)
                        ? 'bg-gray-600'
                        : 'bg-fuchsia-600'
                    } text-white rounded-full`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFollowing(user._id) || isRequested(user._id)) {
                        Meteor.call('unfollowUser', user._id);
                      } else {
                        Meteor.call('followUser', user._id);
                      }
                    }}
                  >
                    {isFollowing(user._id)
                      ? 'Unfollow'
                      : isRequested(user._id)
                      ? 'Requested'
                      : 'Follow'}
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
