import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import Scrollbar from './ScrollBar';
import ProfileDropdown from './ProfileDropdown';

const AllUsersPage = ({ onFollow, onUnfollow, currentUser }) => {
  const navigate = useNavigate();  // Initialize the navigate function
  const users = useTracker(() => {
    Meteor.subscribe('allUsers');
    return Meteor.users.find().fetch();
  });

  const currentUserId = Meteor.userId();

  const isFollowing = (userId) => {
    const currentUser = Meteor.user();
    return currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(userId);
  };

  return (
    <div className="bg-darker min-h-screen p-4">
              <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <Scrollbar className="h-full">
        <div className="grid grid-cols-4 gap-8">
          {users.map((user, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300"
              onClick={() => navigate(`/user/${user._id}`)}  // Add onClick handler here
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
