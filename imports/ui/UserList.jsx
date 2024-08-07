import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

const UserList = React.memo(({ heading, users, searchTerm, onFollow, onUnfollow }) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const defaultAvatarUrl = './default-avatar.png';
  const navigate = useNavigate();
  const currentUserId = Meteor.userId();

  useEffect(() => {
    console.log("UserList component mounted or updated");
  });
  
  // Function to check if the current user is following the given userId
  const isFollowing = (userId) => {
    const currentUser = Meteor.user();
    return currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(userId);
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

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the maximum number of users that can be shown without adjusting card size
  const maxUsersToShow = Math.floor(containerWidth / 220); // assuming 220px is an optimal width per card
  const displayedUsers = filteredUsers.slice(0, maxUsersToShow);

  const handleViewAll = () => {
    navigate("/all-users", { state: { users: filteredUsers.length > 0 ? filteredUsers : users } });
  };

  return (
    <div className="user-list-container bg-transparent py-0">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-semibold">{heading}</h2>
        {console.log('Filtered Users:', filteredUsers)}
        {console.log("Navigating to /all-users with users:", filteredUsers)}

        <button onClick={handleViewAll} className="text-sm text-blue-400">
          View All
        </button>
      </div>
      <div className="flex overflow-hidden">
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
                  if (isFollowing(user._id)) {
                    onUnfollow(user._id);
                  } else {
                    onFollow(user._id);
                  }
                }}
              >
                {isFollowing(user._id) ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default UserList;
