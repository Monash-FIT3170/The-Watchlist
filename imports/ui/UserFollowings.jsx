import React from 'react';
import UserList from './UserList';

export default function UserFollowings() {
    return (
        <div>
            <div className="bg-darker rounded-lg items-center flex flex-col justify-center h-16">
                <h1 className="text-5xl font-semibold">Followings</h1>
            </div>
            <div className="mt-8">
                <UserList heading="Followings" searchTerm="" />
            </div>
        </div>
    );  
}