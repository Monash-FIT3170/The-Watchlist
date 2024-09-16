import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { passwordStrength } from 'check-password-strength';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

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
    const [errorMessage, setErrorMessage] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [strength, setStrength] = useState('');
    const [selectedPrivacy, setSelectedPrivacy] = useState(null);

    useEffect(() => {
        if (currentUser) {
            setUsername(currentUser.username || '');
        }
    }, [currentUser]);

    const handlePrivacyChange = (event) => {
        const value = event.target.name;
        
        setSelectedPrivacy(selectedPrivacy === value ? null : value);
      };

    const handleUpdate = () => {
        if (!username) {
            setErrorMessage('Username cannot be empty.');
            return;
        }

        Meteor.call('users.updateProfile', { username }, (error, result) => {
            if (error) {
                setErrorMessage(error.reason);
            } else {
                setErrorMessage('Profile updated successfully!');
            }
        });
    };

    const handlePasswordStrength = (password) => {
        setStrength(passwordStrength(password).value);
    };

    const handlePasswordChange = () => {
        if (!oldPassword || !newPassword) {
            setErrorMessage('Both old and new passwords must be provided.');
            return;
        }

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
        <div className="flex flex-col min-h-screen bg-darker p-6 text-white">
            <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
            <h4 className="mb-6 text-gray-400">Settings and options for The Watchlist</h4>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

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
            </div>

            <hr className="border-t border-gray-700 my-4" />

            {/* Change Password Section */}
            {/* Change Password Section */}
            {showChangePassword && (
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
    {/* Left Column - Label and Description */}
    <div>
        <label className="block text-lg font-semibold text-white">Password</label>
        <p className="text-gray-400">Update your password to secure your account.</p>
    </div>

    {/* Right Column - Inputs and Button */}
    <div className="space-y-4">
        {/* Old Password Field */}
        <div className="flex items-center space-x-4">
            <input
                type="password"
                value={oldPassword}
                placeholder="Current Password"
                onChange={(e) => setOldPassword(e.target.value)}
                className="bg-darker text-white mt-1 p-3 block w-full shadow-sm sm:text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        {/* New Password Field with Button */}
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
                className="bg-darker text-white mt-1 p-3 block w-3/4 shadow-sm sm:text-sm border border-gray-500 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
            <button
                onClick={handlePasswordChange}
                className="bg-[#7B1450] text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors w-auto whitespace-nowrap"
            >
                Change Password
            </button>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
            <div className="space-y-2">
                {/* Progress Bar */}
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

                {/* Strength Label */}
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

            {/* Left Column - Privacy settings*/}
            <div>
            <label className="block text-lg font-semibold text-white">Privacy Settings</label>
            <p className="text-gray-400">Choose the privacy settings for your account.</p>
            </div>

             {/* Right Column - Privacy settings*/}
             <div className="flex justify-center">
            <div className="space-y-4 ml-64">
            <FormGroup className="flex flex-row space-x-4 text-4xl">
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={selectedPrivacy === 'Public'}
                        onChange={handlePrivacyChange}
                        name="Public"
                        sx={{ transform: 'scale(1.1)' }}
                    />
                    }
                    label={<span className="text-xl">Public</span>}
                />
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={selectedPrivacy === 'Private'}
                        onChange={handlePrivacyChange}
                        name="Private"
                        sx={{ transform: 'scale(1.1)' }}
                    />
                    }
                    label={<span className="text-xl">Private</span>}
                />
                </FormGroup>
            </div>
            </div>


            <hr className="border-t border-gray-700 my-4" />



            

            <div className="mt-8">
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
