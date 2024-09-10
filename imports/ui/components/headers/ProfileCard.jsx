import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaPencilAlt } from 'react-icons/fa';
import { Meteor } from 'meteor/meteor';
import ProfileDropdown from '../profileDropdown/ProfileDropdown';
import AvatarModal from '../../modals/AvatarModal';

const ProfileCard = ({ user, showFollowButton, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) return;
    const currentUser = Meteor.user();
    if (currentUser && Array.isArray(currentUser.following) && currentUser.following.includes(user._id)) {
      setIsFollowing(true);
    }

    Meteor.call('users.ratingsCount', { userId: user._id }, (error, result) => {
      if (error) {
        console.error('Error fetching ratings count:', error);
      } else {
        setRatingsCount(result);
      }
    });
  }, [user._id]);

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
        Meteor.call('updateAvatar', user._id, reader.result, (error) => {
          if (error) {
            console.error('Error updating avatar:', error);
          } else {
            setShowAvatarModal(false);
          }
        });
      };
      reader.readAsDataURL(file); 
    }
  };
  

  const handlePresetAvatarSelect = (avatarUrl) => {
    Meteor.call('updateAvatar', user._id, avatarUrl, (error) => {
      if (error) {
        console.error('Error updating avatar:', error);
      } else {
        setNewAvatar(avatarUrl);
        setShowAvatarModal(false);
      }
    });
  };

  return (
    <div className="relative flex items-center h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer">
          <img
            src={newAvatar || user.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
            alt="avatar"
            className="aspect-square w-56 h-56 object-cover rounded-full shadow-2xl transition-opacity duration-300 ease-in-out"
            onClick={handleAvatarClick}
            style={{ zIndex: 10 }} // Ensures the image is always clickable
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 hover:bg-opacity-50 hover:opacity-100 transition-opacity duration-300 ease-in-out"
            style={{ pointerEvents: 'none' }} // Disables pointer events when not hovering
          >
            <FaPencilAlt className="text-white text-3xl" style={{ pointerEvents: 'auto' }} />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="pl-1 text-8xl font-bold truncate">{user.userName || 'Loading...'}</h2>
          <div className="flex flex-col gap-2 pl-2">
            <div className="flex gap-2 items-center">
              <button className="p-1 text-lg flex-initial hover:underline" onClick={() => navigate(`/followers-following/${user._id}/followers`)}>
                {user.followers} Followers
              </button>
              <span className="text-lg">•</span>
              <button className="p-1 text-lg flex-initial hover:underline" onClick={() => navigate(`/followers-following/${user._id}/following`)}>
                {user.following} Following
              </button>
              <span className="text-lg">•</span>
              <button
                className="p-1 text-lg flex-initial hover:underline"
                onClick={() => {
                  if (user._id === currentUser._id) {
                    navigate(`/user/${user._id}/ratings?userSpecific=true`);
                  } else {
                    navigate(`/user/${user._id}/ratings`);
                  }
                }}>
                {ratingsCount} Ratings
              </button>
            </div>
            <Link to="/user-discovery">
              <button className="mt-2 ml-1 p-3 text-xl bg-transparent border-2 border-white rounded-full hover:bg-white hover:text-zinc-900 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-zinc-700 focus:ring-opacity-50">
                <FaUserPlus />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {showAvatarModal && (
        <AvatarModal
          handleAvatarChange={handleAvatarChange}
          handlePresetAvatarSelect={handlePresetAvatarSelect}
          setShowAvatarModal={setShowAvatarModal}
        />
      )}
    </div>
  );
};

export default ProfileCard;
