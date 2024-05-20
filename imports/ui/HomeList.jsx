import React from "react";
import { useNavigate } from 'react-router-dom';
import RatingStar from './RatingStar';
import { useLists } from './ListContext'; // Import the context
import { getImageUrl } from "./imageUtils";

const List = ({ list }) => {
    const navigate = useNavigate();

    // Function to handle redirection
    const handleRedirect = (type, id) => {
        navigate(`/${type}${id}`);
    };

    return (
        <div key={list._id} className="space-y-8">
            {list.content.map((item) => (
                <div key={item.content_id} className="relative" onClick={() => handleRedirect(item.type, item.content_id)}>
                    <div className="relative rounded-lg shadow-lg cursor-pointer overflow-visible">
                        <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                            <img
                                src={getImageUrl(item.background_url)}
                                alt={item.title}
                                className="w-full h-35vh object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold">{item.title}</h3>
                                    <p className="text-sm">{item.description}</p>
                                    <RatingStar totalStars={5} rating={4} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const HomeList = ({ title, listType }) => { // Remove lists prop
    const { lists } = useLists(); // Use lists from context
    const filteredMovies = lists.filter(list => list.listType === listType);

    return (
        <div className="w-full h-full px-5 py-5 rounded-lg flex flex-col items-left shadow-xl overflow-auto scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-thin">
            <h1 className="font-sans font-bold text-4xl my-4 mt-0 mb-4">{title}</h1>
            <div className="w-full overflow-visible">
                {filteredMovies.map((list) => <List key={list._id} list={list} />)} {/* Add key to List component */}
            </div>
        </div>
    );
};

export default HomeList;