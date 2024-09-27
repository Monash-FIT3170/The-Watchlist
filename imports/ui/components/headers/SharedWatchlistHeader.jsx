import React from 'react';
import ProfileDropdown from '../profileDropdown/ProfileDropdown';
import { useNavigate } from 'react-router-dom';

const SharedWatchlistHeader = ({ list, tabMapping, selectedTab, setSelectedTab, currentUser }) => {
    const navigate = useNavigate();

    const handleUserRedirect = () => {
        navigate(`/user/${list.userId}`);
    }

    return (
        <div className="flex flex-col justify-end items-start w-full h-72 p-4 bg-gradient-to-tl from-zinc-900 via-zinc-700 to-zinc-600 rounded-t-lg shadow-md mb-4">
            <div className="absolute top-4 right-4">
                <ProfileDropdown user={currentUser} />
            </div>

            {list ? (
                <div>
                    <h1 className="text-7xl text-white font-bold mb-2">{`${list.title}`}</h1>
                    <a onClick={handleUserRedirect} className="text-white hover:underline">
                        <span className="text-white hover:underline">{list.userName}</span>
                    </a>
                </div>
            ) : (
                <h1 className="text-7xl text-white font-bold mb-2">No List Found</h1>
            )
            }
            
            <div className="flex gap-4 mb-4">
                <div>
                    {Object.keys(tabMapping).map((tab) => (
                        <div
                            key={tab.toLowerCase()}
                            className={`inline-block px-3 py-1.5 mt-1.5 mb-3 mr-2 rounded-full cursor-pointer transition-all duration-300 ease-in-out ${selectedTab === tab ? 'bg-[#7B1450] text-white border-[#7B1450]' : 'bg-[#282525]'
                                } border-transparent border`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SharedWatchlistHeader;
