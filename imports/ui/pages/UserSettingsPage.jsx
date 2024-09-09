import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import ProfileCard from '../components/headers/ProfileCard';
import ContentList from '../components/lists/ContentList';
import { ListCollection } from '../../db/List';
import ListDisplay from '../components/lists/ListDisplay';
import ProfileDropdown from '../components/profileDropdown/ProfileDropdown';
import { Select } from '@headlessui/react'
import clsx from 'clsx'


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
        <div className = "ml-4 mt-2">
        <Select name="privacy"className={clsx(
              'mt-10 block w-80 appearance-none rounded-lg border-none bg-less-dark py-1.5 px-3 text-md text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
            )} aria-label="Project status">
      <option value="public">Public</option>
      <option value="private">Private</option>
    </Select>
    </div>
    <button
          className="mb-1 mt-8 ml-64 text-md text-white py-2 px-6 rounded-full shadow bg-less-dark hover:bg-darker"
        >
          Save
        </button>

   
        <h1 className = "ml-4 mt-8 text-4xl text-white font-bold mb-4">Profile Photo</h1>
        <div className = "flex flex-row mt-8">
        <img
            src={ currentUser?.avatarUrl || "https://randomuser.me/api/portraits/lego/1.jpg"}
            alt="avatar"
            className="ml-8 aspect-square w-32 h-32 object-cover rounded-full shadow-2xl transition-opacity duration-300 ease-in-out"

            style={{ zIndex: 10 }} // Ensures the image is always clickable
          />
        <button className="h-12  mt-10 ml-24 text-white bg-less-dark  hover:bg-darker rounded-full py-2 px-6">Change Photo</button>
        </div>        
        </div>
    </>
  );
};


export default UserSettingsPage;