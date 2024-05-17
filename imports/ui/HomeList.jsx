// HomeList.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';
import RatingStar from './RatingStar';
import Scrollbar from './ScrollBar';

const List = ({ list }) => {
    const navigate = useNavigate();

    const handleRedirect = (_id) => {
        navigate(`/${_id}`);
    };

    return (
        <div key={list._id} className="space-y-8">
            {list.map((item) => (
                <div key={item._id} className="relative w-1/2 h-1/2 mx-auto" onClick={() => handleRedirect(item._id)}>
                    <div className="relative rounded-lg shadow-lg cursor-pointer overflow-visible">
                        <div className="transition-transform duration-300 ease-in-out transform hover:scale-110">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-50vh object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 rounded-lg transition-opacity duration-300 ease-in-out hover:bg-opacity-60">
                                <div className="text-white flex justify-between w-full items-end">
                                    <div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
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

const HomeList = ({ dummyMovies, title }) => {
    return (
        <div className="flex-grow flex flex-col h-full overflow-hidden">
            <div className="sticky top-0 bg-darker text-light z-10 py-4 w-full">
                <h1 className="font-sans font-bold text-4xl">{title}</h1>
            </div>
            <Scrollbar className="flex-grow px-5 py-5 space-y-8">
                {dummyMovies.map((movie) => <List key={movie._id} list={[movie]} />)}
            </Scrollbar>
        </div>
    );
};

export default HomeList;