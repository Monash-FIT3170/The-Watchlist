import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { handleFollow, handleUnfollow } from '/imports/api/userMethods';

const SimilarUserList = () => {
  const [similarUsers, setSimilarUsers] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loading, setLoading] = useState(true);
  const defaultAvatarUrl = './default-avatar.png';
  const navigate = useNavigate();
  const currentUserId = Meteor.userId();

  useEffect(() => {
    console.log("SimilarUserList component mounted or updated");

    Meteor.call('users.getSimilarUsers', (error, result) => {
      if (error) {
        console.error('Error fetching similar users:', error);
        setLoading(false);
      } else {
        console.log('Similar Users:', result);

        if (result.length === 0) {
          setLoading(false);
          return;
        }

        setSimilarUsers(result);
        console.log('Similar Users:', result);
        setLoading(false);
      }
    });
  }, []);

  // Function to check if the current user is following the given userId
  const isFollowing = (userId) => {
    return (
      currentUser &&
      Array.isArray(currentUser.following) &&
      currentUser.following.some((f) => f.userId === userId)
    );
  };

  const isRequested = (userId) => {
    return (
      currentUser.followingRequests &&
      currentUser.followingRequests.includes(userId)
    );
  };

  useEffect(() => {
    const updateContainerWidth = () => {
      const width = document.querySelector('.user-list-container')?.offsetWidth;
      setContainerWidth(width);
    };

    window.addEventListener('resize', updateContainerWidth);
    updateContainerWidth(); // Call on mount to ensure the container width is set

    return () => {
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Calculate the maximum number of users that can be shown without adjusting card size
  const maxUsersToShow = Math.floor(containerWidth / 220);
  const displayedUsers = similarUsers.slice(0, maxUsersToShow);

  return (
    <div className="user-list-container bg-transparent py-0">
      <div className="flex justify-between items-center">
        <h2 className="text-white text-2xl font-semibold">Discover similar users</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="loader"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      ) : (
        <>
          {similarUsers.length === 0 ? (
            <div className="flex justify-center items-center py-4">
              <p className="text-white text-lg">No similar users found!</p>
            </div>
          ) : (
            <div className="flex overflow-hidden">
              {displayedUsers.map((match, index) => (
                <div key={index} className="min-w-[200px] max-w-[200px] flex flex-col items-center p-2 m-2 rounded-lg hover:bg-gray-700 transition-colors duration-300">
                  <div
                    onClick={() => navigate(`/user/${match.user._id}`)}
                    className="flex flex-col items-center cursor-pointer"
                  >
                    <img src={match.user.avatarUrl || defaultAvatarUrl} alt={match.user.username} className="w-32 h-32 rounded-full" />
                    <p className="text-white mt-2 text-xl text-center">{match.user.username}</p>
                    <p className="text-gray-400 text-sm">Match Score: {match.matchScore}%</p>
                  </div>
                  {currentUserId !== match.user._id && (
                    <button
                    className={`mt-2 px-4 py-1 ${
                      isFollowing(match.user._id)
                        ? 'bg-blue-600'
                        : isRequested(match.user._id)
                        ? 'bg-gray-600'
                        : 'bg-fuchsia-600'
                    } text-white rounded-full`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFollowing(match.user._id) || isRequested(match.user._id)) {
                        Meteor.call('unfollowUser', match.user._id);
                      } else {
                        Meteor.call('followUser', match.user._id);
                      }
                    }}
                  >
                    {isFollowing(match.user._id)
                      ? 'Unfollow'
                      : isRequested(match.user._id)
                      ? 'Requested'
                      : 'Follow'}
                  </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SimilarUserList;
