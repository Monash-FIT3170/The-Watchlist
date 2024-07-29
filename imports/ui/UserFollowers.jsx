import React, { useState } from 'react';
import UserList from './UserList';
import { AiOutlineSearch } from 'react-icons/ai';

export default function UserFollowers() {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

    return (
        <div>
            <div className="bg-darker rounded-lg items-center flex flex-col justify-center h-16">
                <h1 className="text-5xl font-semibold">Followers</h1>
            </div>
            <div className="flex items-center justify-start mb-8 space-x-7 w-full max-w-xl mt-4 ml-1">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        className="rounded-full bg-dark border border-gray-300 pl-10 pr-3 py-3 w-full focus:border-custom-border"
                        placeholder="Search for users..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <AiOutlineSearch className="text-gray-400" size={20} />
                    </span>
                </div>
            </div>
            <div className="mt-8">
                <UserList heading="Followers" searchTerm={searchTerm} />
            </div>
        </div>
    );
}