import React from 'react';
import MovieList from './MovieList.jsx';
import dummyLists from './DummyLists.jsx';
import ContentList from './ContentList.tsx';

export default function AIPicks() {
    const currentUser = 'user1';

    // Filter lists to get only the ones associated with the current user
    const userLists = dummyLists.filter(list => list.userId === currentUser);
    const userInfo = userLists[0] || {};

    const favouritesList = userLists.find(list => list.listId == "favorite-shows")
    const toWatchList = userLists.find(list => list.listId == "must-watch")
    const customWatchlists = userLists.filter(list => list.listId != "favorite-shows" && list.listId != "must-watch")



    return ( 
        <div className="flex flex-col gap-6 overflow-y-hidden h-custom">
            <div className="bg-darker rounded-lg items-center flex flex-col justify-center">
                <h1 className="text-5xl font-semibold mt-8">AI Picks</h1>
                <div className="my-8 items-center w-1/2 flex flex-row">
                    <button
                        className="border border-solid rounded-full px-8 py-4 w-1/3 focus:bg-magenta"
                        onClick={() => console.log("123")}
                    >
                        Movies
                    </button>
                    <div className="w-1/3"></div>
                    <button
                        className="border border-solid rounded-full px-8 py-4 w-1/3 focus:bg-magenta"
                        onClick={() => console.log("123")}
                    >
                        TV Shows
                    </button>
                </div>
            </div>
            <div className="overflow-y-auto scrollbar-webkit">
                <ContentList key={favouritesList.listId} list={favouritesList} />
                <ContentList key={favouritesList.listId} list={favouritesList} />
                <ContentList key={favouritesList.listId} list={favouritesList} />
            </div>
        </div>
     );
};