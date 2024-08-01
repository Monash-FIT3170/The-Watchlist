import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { Meteor } from 'meteor/meteor';

const ProfileCard = ({ user, showFollowButton }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the current user is following this user
    const currentUser = Meteor.user();
    if (currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(user._id)) {
      setIsFollowing(true);
    }
  }, [user._id]);

  const handleFollowToggle = () => {
    if (isFollowing) {
      Meteor.call('unfollowUser', user._id, (error) => {
        if (error) {
          console.error('Error unfollowing user:', error);
        } else {
          setIsFollowing(false);
        }
      });
    } else {
      Meteor.call('followUser', user._id, (error) => {
        if (error) {
          console.error('Error following user:', error);
        } else {
          setIsFollowing(true);
        }
      });
    }
  };

  return (
    <div className="flex items-center h-72 p-4 bg-gradient-to-br from-zinc-900 via-zinc-700 to-zinc-600 rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <img
          src={user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
          alt="avatar"
          className="aspect-square w-56 h-56 object-cover rounded-full shadow-2xl"
        />
        <div>
          <div className="userName flex items-center gap-4">
            <h2 className="p-2 text-2xl font-bold">{user.userName || 'Username'}</h2>
            {showFollowButton && (
              <button
                className={`py-1 px-10 text-xl rounded-lg ${isFollowing ? 'bg-blue-600' : 'bg-fuchsia-600'}`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 text-lg flex-initial"
              onClick={() => navigate(`/followers-following/${user._id}/followers`)}
            >
              {user.followers} Followers
            </button>
            <button
              className="p-2 text-lg flex-initial"
              onClick={() => navigate(`/followers-following/${user._id}/following`)}
            >
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
    </div>
  );
};

export default ProfileCard;
