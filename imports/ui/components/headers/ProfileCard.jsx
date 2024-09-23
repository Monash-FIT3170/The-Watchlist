import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaPencilAlt } from "react-icons/fa";
import { Meteor } from "meteor/meteor";
import ProfileDropdown from "../profileDropdown/ProfileDropdown";

const ProfileCard = ({ user, showFollowButton, currentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user._id) return;
    const currentUser = Meteor.user();
    if (
      currentUser &&
      Array.isArray(currentUser.following) &&
      currentUser.following.includes(user._id)
    ) {
      setIsFollowing(true);
    }

    if (user.userPrivacy === 'Private'){
      setPrivateAccount(true);
    }else{
      setPrivateAccount(false);
    }

    if (currentUser._id === user._id) {
      setIsCurrentUser(true);
    }else{
      setIsCurrentUser(false);
    }

    if (currentUser.followingRequests && currentUser.followingRequests.includes(user._id)) {
      setIsRequested(true); 
    }

    if (user.userPrivacy === 'Private'){
      setPrivateAccount(true);
    }else{
      setPrivateAccount(false);
    }

    if (currentUser._id === user._id) {
      setIsCurrentUser(true);
    }else{
      setIsCurrentUser(false);
    }

    if (currentUser.followingRequests && currentUser.followingRequests.includes(user._id)) {
      setIsRequested(true); 
    }

    Meteor.call("users.ratingsCount", { userId: user._id }, (error, result) => {
      if (error) {
        console.error("Error fetching ratings count:", error);
      } else {
        setRatingsCount(result);
      }
    });
  }, [user._id]);
  const isOwnProfile = currentUser && user && currentUser._id === user._id;

  const handleAvatarClick = () => {
    setShowAvatarModal(true);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
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
        if (!privateAccount){
        setIsFollowing(true);
        console.log('Followed user successfully');
        }else{
          setIsRequested(true);
          console.log('Requested user successfully');
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
        console.log('Unfollowed user successfully');
      }
    });
  };

  const presetAvatars = [
    "https://randomuser.me/api/portraits/lego/1.jpg",
    "https://randomuser.me/api/portraits/lego/2.jpg",
    "https://randomuser.me/api/portraits/lego/3.jpg",
    "https://randomuser.me/api/portraits/lego/4.jpg",
    "https://randomuser.me/api/portraits/lego/5.jpg",
    "https://randomuser.me/api/portraits/lego/6.jpg",
    "https://randomuser.me/api/portraits/lego/7.jpg",
    "https://randomuser.me/api/portraits/lego/8.jpg",
    "https://randomuser.me/api/portraits/lego/9.jpg",
  ];

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
              "https://randomuser.me/api/portraits/lego/1.jpg"
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
            {user.userName || "Loading..."}
          </h2>
          <div className="flex flex-col gap-2 pl-2">
            <div className="flex gap-2 items-center">
            <button
                className={`p-1 text-lg flex-initial ${user.userPrivacy === 'Public' || isCurrentUser || isFollowing  ? 'hover:underline' : 'text-white-500 cursor-not-allowed'}`}
                onClick={user.userPrivacy === 'Public'  || isCurrentUser || isFollowing ? () => navigate(`/followers-following/${user._id}/followers`) : null}
                disabled={user.userPrivacy !== 'Public' && !isCurrentUser && !isFollowing}
              >
                {user.followers} Followers
              </button>
              <span className="text-lg">•</span>
              <button
              className={`p-1 text-lg flex-initial ${user.userPrivacy === 'Public' || isCurrentUser || isFollowing ? 'hover:underline' : 'text-white-500 cursor-not-allowed'}`}
              onClick={user.userPrivacy === 'Public' || isCurrentUser || isFollowing   ? () => navigate(`/followers-following/${user._id}/following`) : null}
              disabled={user.userPrivacy !== 'Public' && !isCurrentUser && !isFollowing}
            >
                {user.following} Following
              </button>
              <span className="text-lg">•</span>
              <button
                className={`p-1 text-lg flex-initial ${user.userPrivacy === 'Public' || isCurrentUser || isFollowing ? 'hover:underline' : 'text-white-500 cursor-not-allowed'}`}
                onClick={() => {
                  if (user.userPrivacy === 'Public' || isCurrentUser || isFollowing){
                  if (user._id === currentUser._id) {
                    navigate(`/user/${user._id}/ratings?userSpecific=true`);
                  } else {
                    navigate(`/user/${user._id}/ratings`);
                  }
                }
                }}
                disabled={user.userPrivacy !== 'Public' && !isCurrentUser  && !isFollowing}
                >
                {ratingsCount} Ratings
              </button>
            </div>
            <div>
              {showFollowButton ? (
                <button
                onClick={() => {
                  if (isFollowing || isRequested) {
                    handleUnfollow();
                  } else {
                    handleFollow();
                  }
                }}
                  className={`mt-2 px-6 py-2 bg-[#7B1450] text-white border-[#7B1450]`}
                >
                    {isFollowing ? 'Unfollow' : isRequested ? 'Requested' : 'Follow'}
                </button>
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

      {showAvatarModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-zinc-700 p-6 rounded-lg shadow-lg max-w-md w-full mt-40">
            <h3 className="text-lg font-bold mb-4 text-center">
              Change Profile Picture
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mb-4 block w-full text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
            />
            <div className="grid grid-cols-5 gap-4 mb-4">
              {presetAvatars.slice(0, 5).map((avatarUrl, index) => (
                <img
                  key={index}
                  src={avatarUrl}
                  alt="preset avatar"
                  className="w-16 h-16 object-cover rounded-full cursor-pointer transition-transform transform hover:scale-110"
                  onClick={() => handlePresetAvatarSelect(avatarUrl)}
                />
              ))}
            </div>
            <div className="flex justify-center">
              <div
                className="grid grid-cols-4 gap-4 mb-4"
                style={{ marginLeft: "0%" }}
              >
                {presetAvatars.slice(5).map((avatarUrl, index) => (
                  <img
                    key={index}
                    src={avatarUrl}
                    alt="preset avatar"
                    className="w-16 h-16 object-cover rounded-full cursor-pointer transition-transform transform hover:scale-110"
                    onClick={() => handlePresetAvatarSelect(avatarUrl)}
                  />
                ))}
              </div>
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
