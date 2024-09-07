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
    const [showConfirmation, setShowConfirmation] = useState(false); // State to toggle delete confirmation
    const [passwordStrength, setPasswordStrength] = useState('');

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

    const handleDeleteUser = () => {
        Meteor.call('users.deleteUser', { username }, (error, result) => {
            if (error) {
                setErrorMessage(error.reason);
            }
        });
    };

    const showChangePassword = currentUser && currentUser.emails;
    return (
        <div className="flex flex-col min-h-screen bg-darker p-6">
            <h1 className="text-4xl font-bold mb-6">Account Settings</h1>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="mb-6 space-y-4">
                <label className="text-2xl font-bold text-white">Change Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-black mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <button
                    onClick={handleUpdate}
                    className="bg-indigo-600 text-white w-full px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Update Profile
                </button>
            </div>

            {/* Only show Change Password section if the user has a password */}
            {showChangePassword  && (
                <div className="space-y-4 mt-8">
                    <h2 className="mb-6 text-2xl font-bold">Change Password</h2>
                    <label className="text-xl font-bold">Old Password</label>
                    <input
                        type="password"
                        value={oldPassword}
                        placeholder="Current Password"
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="text-black mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <label className="text-xl font-bold">New Password</label>
                    <input
                        type={"password"}
                        value={newPassword}
                        placeholder="New Password"
                        className="text-black mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                    <button
                        onClick={handlePasswordChange}
                        className="bg-red-600 text-white w-full px-7 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                        Change Password
                    </button>
                </div>
            )}

            <div className="mt-8">
                {!showConfirmation ? (
                    <button
                        onClick={() => setShowConfirmation(true)}
                        className="bg-red-600 text-white w-full px-7 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                        Delete Account
                    </button>
                ) : (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-neutral-800 p-6 rounded-md">
                            <h2 className="text-xl font-bold">Are you sure?</h2>
                            <h2 className="text-xl font-bold">This action cannot be undone.</h2>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={handleDeleteUser}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

};

export default Settings;
