import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Scrollbar from '../components/scrollbar/ScrollBar';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import { AiOutlineSearch } from 'react-icons/ai';
import { handleFollow, handleUnfollow } from '/imports/api/userMethods';
import { FaCheck, FaTimes } from 'react-icons/fa';


const FollowRequestDisplay = ({ users: propUsers, currentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = Meteor.userId();
  const [searchTerm, setSearchTerm] = useState('');


  const handleAcceptRequest = (userID) => {
    Meteor.call('acceptRequest', userID, (error, result) => {
      if (error) {
        console.error('Error accepting follow request:', error);
      } else {
        console.log('Follow request accepted');
      }
    });
  }

  const handleDeclineRequest = (userID) => {
    Meteor.call('declineRequest', userID, (error, result) => {
      if (error) {
        console.error('Error declining follow request:', error);
      } else {
        console.log('Follow request declined');
      }
    });
  };


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const users = propUsers || location.state?.users || [];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm)
  );


  return (
    <div className="bg-darker min-h-screen p-4">
      <div className="absolute top-4 right-4">
        <ProfileDropdown user={currentUser} />
      </div>
      <div className="flex flex-col items-left w-full">
        <div className="flex items-left justify-start mb-4 space-x-7 w-full max-w-xl mt-1 ml-0">
          <div className="relative flex-grow">
            <input
              type="text"
              className="rounded-full bg-dark border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
              placeholder="Search for users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <AiOutlineSearch className="text-gray-400" size={20} />
            </span>
          </div>
        </div>
        <Scrollbar className="w-full">
          <div className="flex flex-wrap justify-start items-start gap-8 p-4">
            {filteredUsers.map((user, index) => (
              <div
                key={index}
                className="min-w-[200px] max-w-[200px] flex flex-col items-center p-2 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                onClick={() => navigate(`/user/${user._id}`)}
              >
                <div className="flex flex-col items-center cursor-pointer">
                  <img src={user.avatarUrl || './default-avatar.png'} alt={user.username} className="w-full h-auto rounded-full" />
                  <p className="text-white mt-2 text-xl text-center">{user.username}</p>
                </div>

                {currentUserId !== user._id && (
                  <div className="mt-2 flex space-x-4">

                    <button
                      className="bg-green-600 p-2 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptRequest(user._id);
                      }}
                    >
                      <FaCheck className="text-white" />
                    </button>


                    <button
                      className="bg-red-600 p-2 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeclineRequest(user._id);
                      }}
                    >
                      <FaTimes className="text-white" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default FollowRequestDisplay;