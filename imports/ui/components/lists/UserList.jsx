import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { handleFollow, handleUnfollow } from '/imports/api/userMethods';

const UserList = React.memo(({ heading, users, searchTerm, onUnfollow }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const [displayedUsers, setDisplayedUsers] = useState([]);

  const defaultAvatarUrl = './default-avatar.png';
  const navigate = useNavigate();
  const currentUserId = Meteor.userId();

  useEffect(() => {
    console.log("UserList component mounted or updated");
  }, []);
  
  // Function to check if the current user is following the given userId
  const isFollowing = (userId) => {
    const currentUser = Meteor.user();
    return currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(userId);
  };

  const isRequested = (userId) => {
    const currentUser = Meteor.user();
    return (currentUser.followingRequests && currentUser.followingRequests.includes(userId)) 
  };

  // Adjusting how many users to show based on the container width
  useEffect(() => {
    const updateContainerWidth = () => {
      const width = document.querySelector('.user-list-container')?.offsetWidth;
      setContainerWidth(width);
    };

    window.addEventListener('resize', updateContainerWidth);
    updateContainerWidth(); // Call on mount to ensure the container width is set

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Memoize the filtered users so that it only recalculates when `users` or `searchTerm` change
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  useEffect(() => {
    console.log('Filtered Users:', filteredUsers);
  }, [filteredUsers]);
  
  // Calculate the maximum number of users that can be shown without adjusting card size
  useEffect(() => {
    const maxUsersToShow = Math.floor(containerWidth / 220); // assuming 220px is an optimal width per card
    setDisplayedUsers(filteredUsers.slice(0, maxUsersToShow));
  }, [filteredUsers, containerWidth]);

  const containerStyle = !searchTerm ? { display: 'none' } : {};

  return (
    <div className="user-list-container bg-transparent py-0">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-semibold">{heading}</h2>
        {console.log('Filtered Users:', filteredUsers)}
      </div>
      <div className="flex overflow-hidden" style={containerStyle}>
        {displayedUsers.map((user, index) => (
          <div key={index} className="min-w-[200px] max-w-[200px] flex flex-col items-center p-2 m-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <div
              onClick={() => navigate(`/user/${user._id}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <img src={user.avatarUrl || defaultAvatarUrl} alt={user.username} className="w-32 h-32 rounded-full" />
              <p className="text-white mt-2 text-xl text-center">{user.username}</p>
            </div>
            {currentUserId !== user._id && (
              <button
                className={`mt-2 px-4 py-1 ${isFollowing(user._id) ? 'bg-blue-600' : 'bg-fuchsia-600'} text-white rounded-full`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isFollowing(user._id) || isRequested(user._id)) {
                    handleUnfollow(user._id);
                  } else {
                    handleFollow(user._id);
                  }
                }}
              >
                {isFollowing(user._id) ? 'Unfollow'  : isRequested(user._id) ? 'Requested' : 'Follow'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default UserList;
