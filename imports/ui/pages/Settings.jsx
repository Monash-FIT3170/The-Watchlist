import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

const Settings = () => {
    const currentUser = useTracker(() => {
        const handler = Meteor.subscribe('userData', Meteor.userId());
        if (handler.ready()) {
            return Meteor.user();
        }
        return null;
    }, []);

    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState(''); // State for old password
    const [newPassword, setNewPassword] = useState(''); // State for new password
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || '');
        }
    }, [currentUser]);

    const handleUpdate = () => {
        if (!username) {
            setErrorMessage('Username cannot be empty.');
            return;
        }

        // Call method to update user profile
        Meteor.call('users.updateProfile', { username }, (error, result) => {
            if (error) {
                setErrorMessage(error.reason);
            } else {
                setErrorMessage('Profile updated successfully!');
            }
        });
    };

    const handlePasswordChange = () => {
        if (!oldPassword || !newPassword) {
            setErrorMessage('Both old and new passwords must be provided.');
            return;
        }

        // Change user password
        Accounts.changePassword(oldPassword, newPassword, (error) => {
            if (error) {
                setErrorMessage(error.reason);
            } else {
                setErrorMessage('Password changed successfully!');
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-darker p-6">
            <h1 className="text-4xl font-bold mb-6">Account Settings</h1>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="mb-6">
                <label className="text-2xl font-bold text-white">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-black mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
            </div>

            <button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
                Update Profile
            </button>

            <div className="mt-8">
                <h2 className="text-2xl font-bold">Change Password</h2>
                <h3 className="text-xl font-bold">Old Password</h3>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)} // Set old password
                    placeholder="Old Password"
                    className="text-black mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <h3 className="text-xl font-bold">New Password</h3>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} // Set new password
                    placeholder="New Password"
                    className="text-black mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <button
                    onClick={handlePasswordChange}
                    className="bg-red-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                    Change Password
                </button>
            </div>
        </div>
    );
};

export default Settings;
