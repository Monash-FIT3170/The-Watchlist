import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const ProfileCard = ({ user, onFollow, showFollowButton }) => {
  return (
    <div className="flex items-center h-72 p-4 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-600 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={user.avatarUrl || './default-avatar.png'}
          alt="avatar"
          className="aspect-square w-56 h-56 object-cover rounded-full shadow-2xl"
        />
        <div>
          <div className="userName flex items-center gap-4">
            <h2 className="p-2 text-2xl font-bold">{user.userName || 'Username'}</h2>
            {showFollowButton && (
              <button className="py-1 px-10 text-xl rounded-lg bg-fuchsia-600" onClick={() => onFollow(user._id)}>Follow</button>
            )}
          </div>
          <div className="flex gap-2">
            <span className="p-2 text-lg flex-initial">{user.ratings} Ratings</span>
            <span className="p-2 text-lg flex-initial">{user.followers} Followers</span>
            <span className="p-2 text-lg flex-initial">{user.following} Following</span>
            <Link to="/user-discovery">
              <button className="mt-2 p-1 bg-darker rounded-lg">
                <FaPlus />
              </button>
            </Link>
          </div>
          <div className="p-2">
            <div className="font-bold user-name">{user.userRealName || user.userName}</div>
            <div className="text-sm user-description">{user.userDescription}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
