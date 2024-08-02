import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown';

const AllUsersPage = ({ users: propUsers, onFollow, onUnfollow, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('prop users: ', propUsers); // Check props received by AllUsersPage
    console.log('state users: ', location.state?.users); // Check if any users are passed via router state
  }, [propUsers, location.state]);

  const users = propUsers || location.state?.users || [];
  const currentUserId = currentUser && currentUser._id;

  const isFollowing = (userId) => {
    return currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(userId);
  };

  return (
    <div className="bg-darker min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <Scrollbar className="h-full">
        <div className="grid grid-cols-4 gap-8">
          {users.map((user) => (
            <div 
              key={user._id} 
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              onClick={() => navigate(`/user/${user._id}`)}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <img src={user.avatarUrl || './default-avatar.png'} alt={user.username} className="w-32 h-32 rounded-full aspect-square" />
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
      </Scrollbar>
    </div>
  );
};

export default AllUsersPage;
