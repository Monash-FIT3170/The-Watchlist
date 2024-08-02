import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    Meteor.logout((error) => {
      if (error) {
        console.error('Logout failed', error);
      } else {
        console.log('User logged out successfully');
      }
    });
  };

  console.log("User in ProfileDropdown:", user);


  // If the user is not logged in, don't render the dropdown
  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <img
        src={user.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
        alt="avatar"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={toggleDropdown}
      />
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-darkest rounded-lg shadow-lg z-50">
          <ul className="py-1">
            <li>
              <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-700">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
