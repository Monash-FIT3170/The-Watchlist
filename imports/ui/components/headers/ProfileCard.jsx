// imports/ui/components/headers/ProfileCard.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaPencilAlt } from 'react-icons/fa';
import ProfileDropdown from '../profileDropdown/ProfileDropdown';
import AvatarModal from '../../modals/AvatarModal';

const ProfileCard = React.memo(({ user, showFollowButton, currentUser, isFollowing, isRequested, toggleFollow }) => {
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id || !currentUser) return;

    // Set privacy state
    if (user.userPrivacy === 'Private') {
      setPrivateAccount(true);
    } else {
      setPrivateAccount(false);
    }

    // Check if viewing own profile
    setIsCurrentUser(currentUser._id === user._id);
  }, [user, currentUser]);

  const isOwnProfile = currentUser && user && currentUser._id === user._id;

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
        Meteor.call("updateAvatar", user._id, reader.result, (error) => {
          if (error) {
            console.error("Error updating avatar:", error);
          } else {
            setShowAvatarModal(false);
          }
        });
      };
      reader.readAsDataURL(file); 
    }
  };
  

  const handlePresetAvatarSelect = (avatarUrl) => {
    Meteor.call("updateAvatar", user._id, avatarUrl, (error) => {
      if (error) {
        console.error("Error updating avatar:", error);
      } else {
        setNewAvatar(avatarUrl);
        setShowAvatarModal(false);
      }
    });
  };

  const handleFollow = () => {
    Meteor.call("followUser", user._id, (error, result) => {
      if (error) {
        console.error("Error following user:", error);
      } else {
        if (!privateAccount) {
          setIsFollowing(true);
          console.log('Followed user successfully');
        } else {
          setIsRequested(true);
          console.log("Requested user successfully");
        }
      }
    });
  };

  const handleUnfollow = () => {
    Meteor.call("unfollowUser", user._id, (error, result) => {
      if (error) {
        console.error("Error unfollowing user:", error);
      } else {
        setIsFollowing(false);
        setIsRequested(false);
        console.log("Unfollowed user successfully");
      }
    });
  };

  return (
    <div className="relative flex items-center h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group w-56 h-56 rounded-full overflow-hidden">
          <img
            src={
              newAvatar ||
              user.avatarUrl ||
              'https://randomuser.me/api/portraits/lego/1.jpg'
            }
            alt="avatar"
            className="w-full h-full object-cover"
          />
          {isOwnProfile && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out cursor-pointer"
              onClick={handleAvatarClick}
            >
              <FaPencilAlt className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="pl-1 text-8xl font-bold truncate">
            {user.userName || 'Loading...'}
          </h2>
          <div className="flex flex-col gap-2 pl-2">
            <div className="flex gap-2 items-center">
              <button
                className={`p-1 text-lg flex-initial ${user.userPrivacy === 'Public' || isCurrentUser || isFollowing
                    ? 'hover:underline'
                    : 'text-gray-500 cursor-not-allowed'
                  }`}
                onClick={
                  user.userPrivacy === 'Public' || isCurrentUser || isFollowing
                    ? () => navigate(`/followers-following/${user._id}/followers`)
                    : null
                }
                disabled={
                  user.userPrivacy !== 'Public' &&
                  !isCurrentUser &&
                  !isFollowing
                }
              >
                {user.followers} Followers
              </button>
              <span className="text-lg">•</span>
              <button
                className={`p-1 text-lg flex-initial ${user.userPrivacy === 'Public' || isCurrentUser || isFollowing
                    ? 'hover:underline'
                    : 'text-gray-500 cursor-not-allowed'
                  }`}
                onClick={
                  user.userPrivacy === 'Public' || isCurrentUser || isFollowing
                    ? () => navigate(`/followers-following/${user._id}/following`)
                    : null
                }
                disabled={
                  user.userPrivacy !== 'Public' &&
                  !isCurrentUser &&
                  !isFollowing
                }
              >
                {user.following} Following
              </button>
              <span className="text-lg">•</span>
              <button
                className={`p-1 text-lg flex-initial ${user.userPrivacy === 'Public' || isCurrentUser || isFollowing
                    ? 'hover:underline'
                    : 'text-gray-500 cursor-not-allowed'
                  }`}
                onClick={() => {
                  if (
                    user.userPrivacy === 'Public' ||
                    isCurrentUser ||
                    isFollowing
                  ) {
                    if (user._id === currentUser._id) {
                      navigate(`/user/${user._id}/ratings?userSpecific=true`);
                    } else {
                      navigate(`/user/${user._id}/ratings`);
                    }
                  }
                }}
                disabled={
                  user.userPrivacy !== 'Public' &&
                  !isCurrentUser &&
                  !isFollowing
                }
              >
                {user.ratings} Ratings
              </button>
            </div>
            <div>
              {showFollowButton ? (
                currentUser._id !== user._id && (
                  <button
                    onClick={toggleFollow}
                    className={`mt-2 px-6 py-2 ${isFollowing
                        ? 'bg-blue-600'
                        : isRequested
                          ? 'bg-gray-600'
                          : 'bg-fuchsia-600'
                      } text-white rounded-full`}
                  >
                    {isFollowing ? 'Unfollow' : isRequested ? 'Requested' : 'Follow'}
                  </button>
                )
              ) : (
                <Link to="/user-discovery">
                  <button className="mt-2 ml-1 p-3 text-xl bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-zinc-900 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-zinc-700 focus:ring-opacity-50">
                    <FaUserPlus />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      {showAvatarModal && (
        <div style={{ zIndex: 1000, position: 'relative' }}>
          <AvatarModal
            handleAvatarChange={handleAvatarChange}
            handlePresetAvatarSelect={handlePresetAvatarSelect}
            setShowAvatarModal={setShowAvatarModal}
          />
        </div>
      )}
    </div>
  );
});

export default ProfileCard;
