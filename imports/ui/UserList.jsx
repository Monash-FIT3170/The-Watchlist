import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

const UserList = ({ heading, searchTerm, onFollow, onUnfollow }) => {
  const defaultAvatarUrl = './default-avatar.png';
  const navigate = useNavigate();
  const currentUserId = Meteor.userId();

  const users = useTracker(() => {
    const subscription = Meteor.subscribe('allUsers');
    if (!subscription.ready()) {
      return [];
    }
    return Meteor.users.find({
      username: { $regex: searchTerm, $options: 'i' },
    }).fetch();
  }, [searchTerm]);

  const isFollowing = (userId) => {
    const currentUser = Meteor.user();
    return currentUser && currentUser.following.includes(userId);
  };

  return (
    <div className="bg-darker p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-2xl font-semibold">{heading}</h2>
        <Link to="/all-users" className="text-sm text-blue-400">View All</Link>
      </div>
      <div className="grid grid-cols-6 gap-8">
        {users.map((user, index) => (
          <div key={index} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <div 
              onClick={() => navigate(`/user/${user._id}`)}
              className="flex flex-col items-center cursor-pointer"
            >
              <img src={user.avatarUrl || defaultAvatarUrl} alt={user.username} className="w-full h-auto rounded-full aspect-square" />
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
};

export default UserList;
