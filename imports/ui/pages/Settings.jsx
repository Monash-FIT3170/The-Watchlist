import React, { useState, useEffect } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { passwordStrength } from "check-password-strength";
import ProfileDropdown from "../components/profileDropdown/ProfileDropdown";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Meteor } from "meteor/meteor";

const Settings = () => {
  const currentUser = useTracker(() => {
    const handler = Meteor.subscribe("userData", Meteor.userId());
    if (handler.ready()) {
      return Meteor.user();
    }
    return null;
  }, []);

  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [usernameSuccessMessage, setUsernameSuccessMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [strength, setStrength] = useState("");
  const [selectedPrivacy, setSelectedPrivacy] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setUsername(currentUser.username || "");
      setSelectedPrivacy(currentUser.profile?.privacy || "Public");

      // If existing users do not have a privacy setting, set it to public
      if (currentUser.profile?.privacy === undefined) {
        Meteor.call("users.updatePrivacy", "Public", (error) => {
          if (error) {
            console.error("Error updating privacy setting:", error.reason);
          } else {
            console.log("Privacy setting updated to:", "Public");
          }
        });
      }
    }
  }, [currentUser]);

  const handleUpdate = () => {
    if (!username) {
      setUsernameErrorMessage("Username cannot be empty.");
      setUsernameSuccessMessage("");
      return;
    }

    Meteor.call("users.updateProfile", { username }, (error, result) => {
      if (error) {
        setUsernameErrorMessage(error.reason);
        setUsernameSuccessMessage("");
      } else {
        setUsernameSuccessMessage("Profile updated successfully!");
        setUsernameErrorMessage("");
      }
    });
  };

  const handlePrivacyChange = (event) => {
    const value = event.target.name;
    setSelectedPrivacy(value);
    Meteor.call("users.updatePrivacy", value, (error) => {
      if (error) {
        console.error("Error updating privacy setting:", error.reason);
      } else {
        console.log("Privacy setting updated to:", value);
      }
    });
  };

  const handlePasswordStrength = (password) => {
    setStrength(passwordStrength(password).value);
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordErrorMessage("All fields are required.");
      setPasswordSuccessMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage("Passwords do not match.");
      setPasswordSuccessMessage("");
      return;
    }

    Accounts.changePassword(oldPassword, newPassword, (error) => {
      if (error) {
        setPasswordErrorMessage(error.reason);
        setPasswordSuccessMessage("");
      } else {
        setPasswordSuccessMessage("Password changed successfully!");
        setPasswordErrorMessage("");
      }
    });
  };

  const handleDeleteUser = () => {
    Meteor.call("users.deleteUser", { username }, (error, result) => {
      if (error) {
        setUsernameErrorMessage(error.reason);
      }
    });
  };

  const showChangePassword = currentUser && currentUser.emails;

  return (
    <div className="flex flex-col min-h-screen bg-darker p-6 text-white">
      <div className="absolute top-4 right-8">
        <ProfileDropdown user={currentUser} />
      </div>
      <h1 className="text-3xl font-bold mb-1">Account Settings</h1>
      <h4 className="mb-6 text-gray-400">
        Settings and options for The Watchlist
      </h4>

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
        {usernameSuccessMessage && (
          <p className="text-green-500 mt-2">{usernameSuccessMessage}</p>
        )}
        {usernameErrorMessage && (
          <p className="text-red-500 mt-2">{usernameErrorMessage}</p>
        )}
      </div>

      <hr className="border-t border-gray-700 my-4" />

      {/* Change Password Section */}
      {showChangePassword && (
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div>
            <label className="block text-lg font-semibold text-white">
              Password
            </label>
            <p className="text-gray-400">
              Update your password to secure your account.
            </p>
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
            {passwordSuccessMessage && (
              <p className="text-green-500 mt-2">{passwordSuccessMessage}</p>
            )}
            {passwordErrorMessage && (
              <p className="text-red-500 mt-2">{passwordErrorMessage}</p>
            )}

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="space-y-2">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-pink-200">
                    <div
                      style={{
                        width:
                          strength === "Weak"
                            ? "25%"
                            : strength === "Medium"
                            ? "50%"
                            : strength === "Strong"
                            ? "100%"
                            : "0%",
                      }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        strength === "Weak"
                          ? "bg-red-600"
                          : strength === "Medium"
                          ? "bg-yellow-400"
                          : strength === "Strong"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                  </div>
                  <p className="text-xs text-white">Strength: {strength}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <hr className="border-t border-gray-700 my-4" />

      {/* Privacy Settings Section */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <div>
          <label className="block text-lg font-semibold text-white">
            Privacy Settings
          </label>
          <p className="text-gray-400">
            Manage who can view your activity and profile.
          </p>
        </div>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPrivacy === "Public"}
                onChange={handlePrivacyChange}
                name="Public"
              />
            }
            label="Public"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={selectedPrivacy === "Private"}
                onChange={handlePrivacyChange}
                name="Private"
              />
            }
            label="Private"
          />
        </FormGroup>
      </div>

      <hr className="border-t border-gray-700 my-4" />

      <div className="mb-6">
        <label className="block text-lg font-semibold text-white">
          Danger Zone
        </label>
        <p className="text-gray-400">Delete your account permanently.</p>
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-auto"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
