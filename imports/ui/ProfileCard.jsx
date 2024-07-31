// imports/ui/ProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import FollowersFollowingList from './FollowersFollowingList';

const ProfileCard = ({ user, onFollow, showFollowButton }) => {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  useEffect(() => {
    const avatarPath = user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"; // Use absolute path
    const img = new Image();
    img.onload = () => console.log(`Image exists at ${avatarPath}:`, true);
    img.onerror = () => console.log(`Image exists at ${avatarPath}:`, false);
    img.src = avatarPath;
  }, [user.avatarUrl]);

  return (
    <div className="flex items-center h-72 p-4 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-600 rounded-lg shadow-md mb-4">
      <div className="flex items-center gap-4">
        <img
          src={user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"} // Use absolute path
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
            <button className="p-2 text-lg flex-initial" onClick={() => { console.log('Show Followers clicked'); setShowFollowers(true); }}>
              {user.followers} Followers
            </button>
            <button className="p-2 text-lg flex-initial" onClick={() => { console.log('Show Following clicked'); setShowFollowing(true); }}>
              {user.following} Following
            </button>
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
      {showFollowers && (
        <FollowersFollowingList userId={user._id} type="followers" show={showFollowers} onClose={() => { console.log('Close Followers'); setShowFollowers(false); }} />
      )}
      {showFollowing && (
        <FollowersFollowingList userId={user._id} type="following" show={showFollowing} onClose={() => { console.log('Close Following'); setShowFollowing(false); }} />
      )}
    </div>
  );
};

export default ProfileCard;
