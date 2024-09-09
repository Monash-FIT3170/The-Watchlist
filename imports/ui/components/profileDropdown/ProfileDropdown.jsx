import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProfileDropdown = ({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // If the user is not logged in, don't render the dropdown
  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src={user.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
        alt="avatar"
        className="w-10 h-10 rounded-full cursor-pointer"
        onClick={toggleDropdown}
      />
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-50">
          <ul className="py-2">
            <li>
              <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/user-settings" className="block px-4 py-2 text-sm hover:bg-gray-700">
                Settings
              </Link>
            </li>
            <li className="border-t border-gray-700 mt-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
