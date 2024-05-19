import React, { useState } from 'react';
import Modal from './Modal'; 

const MovieInfo = ({ movie, initialLists }) => { 
    const [showModal, setShowModal] = useState(false);
    const [lists, setLists] = useState(initialLists);

    const handleAddContent = (listId, content) => {
        const userId = 1; // Temporary userId: 1
        
        Meteor.call('list.addContent', { listId, userId, content }, (error, result) => {
            if (error) {
                console.error("Error adding content to list:", error);
            } else {
                console.log("Content added to list successfully:", result);
                
                // Update the state with the new content
                setLists(lists.map(list => {
                    if (list._id === listId) {
                        return {
                            ...list,
                            content: [...list.content, content]
                        };
                    }
                    return list;
                }));
                setShowModal(false);
            }
        });
    };
    
    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative" style={{ backgroundImage: `url(${movie.image_url})` }}>
            <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${movie.image_url})` }}></div>
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
                <div className="w-full h-3/4 rounded-xl shadow-md overflow-hidden md:max-w-4xl bg-black bg-opacity-90 text-white flex flex-row items-center justify-between px-5">
                    <div className="flex flex-col items-start w-2/5 gap-4">
                        <img src={movie.image_url} alt={movie.title} className="w-full h-auto rounded-lg mb-5 ml-6" />
                        <button 
                            className="px-5 py-2 border-none rounded-lg cursor-pointer bg-white text-purple-500 mb-5 ml-6"
                            onClick={() => setShowModal(true)}
                        >
                            +
                        </button>
                    </div>
                    <div className="flex flex-col items-start w-1/2 h-full overflow-y-auto px-0 py-4">
                        <h1 className="text-6xl font-bold text-center">{movie.title} ({movie.release_year})</h1>
                        <p className="text-2xl font-semibold text-center mt-5">SYNOPSIS</p>
                        <p className="text-lg text-center max-w-xl mt-5">{movie.overview}</p>
                        <p className="text-2xl font-semibold text-center mt-5">RUNTIME</p>
                        <p className="text-lg font-bold text-center mt-5"> {movie.runtime}</p>
                        <p className="text-2xl font-semibold text-center mt-5">RATING</p>
                        <p className="text-lg font-bold text-center mt-5"> {movie.rating}</p>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} content={movie} type="Movie" />
        </div>
    );
};

export default MovieInfo;
