import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileCard from '../components/headers/ProfileCard';
import ContentList from '../components/lists/ContentList';
import { ListCollection } from '../../db/List';
import ListDisplay from '../components/lists/ListDisplay';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';


const UserSettingsPage= () => {

    const { userId } = useParams();
    const [userLists, setUserLists] = useState([]);
    const [globalRatings, setGlobalRatings] = useState({});

  const currentUser = useTracker(() => {
    const handler = Meteor.subscribe('userData', Meteor.userId());
    if (handler.ready()) {
      return Meteor.user();
    }
    return null;
  }, []);

  return (
    <>
    <div className="flex flex-col justify-end items-start w-full h-52 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
      <div className="absolute top-4 right-6">
        <ProfileDropdown user={currentUser} />
      </div>
      <h1 className="text-7xl text-white font-bold mb-2">User Settings</h1>
      <div className="flex gap-4 mb-4">
      </div>
    </div>
    <div classname = "flex flex-col items-center">
        <h1 className = "ml-4 text-4xl text-white font-bold mb-2">Profile Visibility</h1>
        <h1 className = "ml-4 mt-10 text-4xl text-white font-bold mb-2">Profile Photo</h1>
        <button className="mt-5 ml-10 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">Change Photo</button>
        <h1 className = "ml-4 text-4xl text-white font-bold mb-2">Change Username</h1>
        </div>
    </>
  );
};


export default UserSettingsPage;