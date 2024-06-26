import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const ProfileCard = ({ userName, ratings, followers, following, avatarUrl, userRealName, userDescription}) => {
  return (
    <div className="flex items-center h-72 p-4 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-600 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={avatarUrl}
          alt="avatar"
          className="aspect-square w-56 h-56 object-cover rounded-full shadow-2xl"
        />
        
        <div>
            <div className="userName flex items-center gap-4">
                <h2 className="p-2 text-2xl font-bold">{userName || 'Username'}</h2>
                <button className="py-1 px-10 text-xl rounded-lg bg-fuchsia-600">Follow</button>
            </div>
          <div className="flex gap-2">
            <span className="p-2 text-lg flex-initial gap-2">{ratings} Ratings</span>
            <span className="p-2 text-lg flex-initial gap-2">{followers} Followers</span>
            <span className="p-2 text-lg flex-initial gap-2">{following} Following</span>
            <Link to="/user-discovery">
              <button className="mt-2 p-1 bg-darker rounded-lg">
                <FaPlus />
              </button>
            </Link>
          </div>
          <div className="p-2">
            <div class="font-bold user-name">{userRealName || userName}</div>
            <div class="text-sm user-description">{userDescription}</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
