// imports/ui/FollowersFollowingList.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import Scrollbar from './ScrollBar';

const FollowersFollowingList = ({ userId, type, show, onClose }) => {
  const [usersList, setUsersList] = useState([]);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const fetchUsers = async () => {
        try {
          console.log(`Fetching ${type} for userId:`, userId);
          const users = await new Promise((resolve, reject) => {
            Meteor.call(`users.${type}`, { userId }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            });
          });
          console.log(`${type} fetched:`, users);
          setUsersList(users);
        } catch (error) {
          console.error(`Error fetching ${type}:`, error);
        }
      };
      fetchUsers();
    }
  }, [show, userId, type]);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      console.log('Clicked outside the popup');
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [show]);

  const handleUserClick = (userId) => {
    console.log('User clicked:', userId);
    onClose();
    navigate(`/user/${userId}`);
  };

  return (
    show && (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div
          ref={popupRef}
          className="bg-darker p-6 rounded-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-3/4 overflow-y-auto relative"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <button
              className="text-2xl font-bold text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <Scrollbar className="space-y-8 max-h-[calc(100vh-10rem)]">
            {usersList.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user._id)}
                className="flex items-center space-x-4 p-2 border-b border-gray-200 hover:bg-gray-700 cursor-pointer"
              >
                <img
                  src={user.avatarUrl || './default-avatar.png'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <span className="text-white">{user.username}</span>
              </div>
            ))}
          </Scrollbar>
        </div>
      </div>
    )
  );
};

export default FollowersFollowingList;
