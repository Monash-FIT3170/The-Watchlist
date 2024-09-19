import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { passwordStrength } from 'check-password-strength';

const Settings = () => {
    const currentUser = useTracker(() => {
        const handler = Meteor.subscribe('userData', Meteor.userId());
        if (handler.ready()) {
            return Meteor.user();
        }
        return null;
    }, []);

    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [usernameSuccessMessage, setUsernameSuccessMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [strength, setStrength] = useState('');

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || '');
        }
    }, [currentUser]);

    const handleUpdate = () => {
        // Check if the username is within the allowed length
        if (!username) {
            setUsernameErrorMessage('Username cannot be empty.');
            setUsernameSuccessMessage('');
            return;
        }
        
        // Ensure username is between 3 and 15 characters
        if (username.length < 3 || username.length > 15) {
            setUsernameErrorMessage('Username must be between 3 and 15 characters.');
            setUsernameSuccessMessage('');
            return;
        }
    
        // Proceed with updating the profile if validations pass
        Meteor.call('users.updateProfile', { username }, (error, result) => {
            if (error) {
                setUsernameErrorMessage(error.reason);
                setUsernameSuccessMessage('');
            } else {
                setUsernameSuccessMessage('Profile updated successfully!');
                setUsernameErrorMessage('');
            }
        });
    };
    

    const handlePasswordStrength = (password) => {
        setStrength(passwordStrength(password).value);
    };

    const handlePasswordChange = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setPasswordErrorMessage('All fields are required.');
            setPasswordSuccessMessage('');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordErrorMessage('Passwords do not match.');
            setPasswordSuccessMessage('');
            return;
        }

        Accounts.changePassword(oldPassword, newPassword, (error) => {
            if (error) {
                setPasswordErrorMessage(error.reason);
                setPasswordSuccessMessage('');
            } else {
                setPasswordSuccessMessage('Password changed successfully!');
                setPasswordErrorMessage('');
            }
        });
    };

    const handleDeleteUser = () => {
        Meteor.call('users.deleteUser', { username }, (error, result) => {
            if (error) {
                setUsernameErrorMessage(error.reason);
            }
        });
    };

    const showChangePassword = currentUser && currentUser.emails;

    return (
        <div className="flex flex-col min-h-screen bg-darker p-6 text-white">
            <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
            <h4 className="mb-6 text-gray-400">Settings and options for The Watchlist</h4>

            {/* Change Username Section */}
            <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                    <label className="block text-lg font-semibold text-white">Name</label>
                    <p className="text-gray-400">Changes will update your username.</p>
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-darker text-white mt-1 p-3 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        onClick={handleUpdate}
                        className="bg-[#7B1450] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors w-auto"
                    >
                        Update
                    </button>
                </div>

                {/* Success/Error Message for Name Change */}
                {usernameSuccessMessage && <p className="text-green-500 mt-2">{usernameSuccessMessage}</p>}
                {usernameErrorMessage && <p className="text-red-500 mt-2">{usernameErrorMessage}</p>}
            </div>

            <hr className="border-t border-gray-700 my-4" />

            {/* Change Password Section */}
            {showChangePassword && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                    <div>
                        <label className="block text-lg font-semibold text-white">Password</label>
                        <p className="text-gray-400">Update your password to secure your account.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <input
                                type="password"
                                value={oldPassword}
                                placeholder="Current Password"
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="bg-darker text-white mt-1 p-3 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <input
                                type="password"
                                value={newPassword}
                                placeholder="New Password"
                                minLength={6}
                                onChange={(e) => {
                                    const newPass = e.target.value;
                                    setNewPassword(newPass);
                                    handlePasswordStrength(newPass);
                                }}
                                className="bg-darker text-white mt-1 p-3 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="flex items-center space-x-4">
                            <input
                                type="password"
                                value={confirmPassword}
                                placeholder="Confirm Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="bg-darker text-white mt-1 p-3 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            onClick={handlePasswordChange}
                            className="bg-[#7B1450] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors w-auto whitespace-nowrap"
                        >
                            Change Password
                        </button>

                        {/* Success/Error Message for Password Change */}
                        {passwordSuccessMessage && <p className="text-green-500 mt-2">{passwordSuccessMessage}</p>}
                        {passwordErrorMessage && <p className="text-red-500 mt-2">{passwordErrorMessage}</p>}

                        {/* Password Strength Indicator */}
                        {newPassword && (
                            <div className="space-y-2">
                                <div className="relative pt-1">
                                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
                                        <div
                                            style={{
                                                width:
                                                    strength === 'Too weak'
                                                        ? '25%'
                                                        : strength === 'Weak'
                                                        ? '50%'
                                                        : strength === 'Medium'
                                                        ? '75%'
                                                        : '100%',
                                            }}
                                            className={`flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                                strength === 'Too weak'
                                                    ? 'bg-red-600'
                                                    : strength === 'Weak'
                                                    ? 'bg-yellow-500'
                                                    : strength === 'Medium'
                                                    ? 'bg-blue-500'
                                                    : 'bg-green-500'
                                            }`}
                                        ></div>
                                    </div>
                                </div>

                                <p
                                    className={`font-semibold ${
                                        strength === 'Too weak'
                                            ? 'text-red-600'
                                            : strength === 'Weak'
                                            ? 'text-yellow-500'
                                            : strength === 'Medium'
                                            ? 'text-blue-500'
                                            : 'text-green-500'
                                    }`}
                                >
                                    {strength === 'Too weak'
                                        ? 'Password is too weak. Consider adding numbers, symbols, and more characters.'
                                        : strength === 'Weak'
                                        ? 'Password is weak. Add a mix of uppercase, lowercase, and special characters.'
                                        : strength === 'Medium'
                                        ? 'Password is decent but could be stronger.'
                                        : 'Strong password!'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <hr className="border-t border-gray-700 my-4" />

            <div className="mt-8 flex space-x-4">
    <button
        onClick={() => Meteor.logout()}
        className="bg-gray-600 text-white px-7 py-2 rounded-md hover:bg-gray-700 transition-colors w-auto"
    >
        Log Out
    </button>
    {!showConfirmation ? (
        <button
            onClick={() => setShowConfirmation(true)}
            className="bg-red-600 text-white px-7 py-2 rounded-md hover:bg-red-700 transition-colors w-auto"
        >
            Delete Account
        </button>
    ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-md">
                <h2 className="text-lg font-semibold">Are you sure?</h2>
                <p>This action cannot be undone.</p>
                <div className="mt-4 flex justify-between space-x-4">
                    <button
                        onClick={handleDeleteUser}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-auto"
                    >
                        Yes, Delete
                    </button>
                    <button
                        onClick={() => setShowConfirmation(false)}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors w-auto"
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
