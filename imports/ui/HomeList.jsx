import React from "react";
import { useNavigate } from 'react-router-dom';
import RatingStar from './RatingStar';
import Scrollbar from './ScrollBar';

const List = ({ list }) => {
    const navigate = useNavigate();

    const handleRedirect = (type, id) => {
        navigate(`/${type}${id}`);
    };

    return (
        <div key={list.listId} className="space-y-8">
            {list.content.map((item) => (
                <div key={item.id} className="relative" onClick={() => handleRedirect(item.type, item.id)}>
                    <div className="relative rounded-lg shadow-lg cursor-pointer overflow-visible">
                        <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-35vh object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                                <div className="text-white flex justify-between w-full items-end">
                                    <div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                        <p className="text-sm">{item.description}</p>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                        <RatingStar totalStars={5} rating={item.rating} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const HomeList = ({ dummyMovies, title, listType }) => {
    const filteredMovies = dummyMovies.filter(list => list.listType === listType);

    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="sticky top-0 bg-darker text-light z-10 py-4 w-full">
                <h1 className="font-sans font-bold text-4xl">{title}</h1>
            </div>
            <Scrollbar className="flex-grow px-5 py-5 space-y-8">
                {filteredMovies.map((list) => <List key={list.listId} list={list} />)}
            </Scrollbar>
        </div>
    );
};

export default HomeList;
