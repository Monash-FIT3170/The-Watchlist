import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaPencilAlt } from 'react-icons/fa';
import { Meteor } from 'meteor/meteor';
import ProfileDropdown from './ProfileDropdown';
import { RatingCollection } from '../db/Rating';

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

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
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

  const presetAvatars = [
    "https://randomuser.me/api/portraits/lego/1.jpg",
    "https://randomuser.me/api/portraits/lego/2.jpg",
    "https://randomuser.me/api/portraits/lego/3.jpg",
  ];

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

        <div>
          <h2 className="p-2 text-8xl font-bold truncate">{user.userName || 'Loading...'}</h2>
          <div className="flex gap-2">
            <button className="p-1 text-lg flex-initial hover:underline" onClick={() => navigate(`/followers-following/${user._id}/followers`)}>
              • {user.followers} Followers
            </button>
            <button className="p-1 text-lg flex-initial hover:underline" onClick={() => navigate(`/followers-following/${user._id}/following`)}>
              • {user.following} Following
            </button>
            <button
              className="p-1 text-lg flex-initial hover:underline"
              onClick={() => {
                if (user._id === currentUser._id) {
                  navigate(`/user/${user._id}/ratings?userSpecific=true`);
                } else {
                  navigate(`/user/${user._id}/ratings`);
                }
              }}>
              • {ratingsCount} Ratings
            </button>
            <Link to="/user-discovery">
              <button className="mt-2 p-1 bg-darker rounded-lg">
                <FaPlus />
              </button>
            </Link>
          </div>
        </div>
      </div>

      {showAvatarModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-700 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 text-center">Change Profile Picture</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mb-4 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
            />
            <div className="flex gap-4 justify-center mb-4">
              {presetAvatars.map((avatarUrl, index) => (
                <img
                  key={index}
                  src={avatarUrl}
                  alt="preset avatar"
                  className="w-16 h-16 object-cover rounded-full cursor-pointer transition-transform transform hover:scale-110"
                  onClick={() => handlePresetAvatarSelect(avatarUrl)}
                />
              ))}
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                onClick={() => setShowAvatarModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
