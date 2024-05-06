import React from 'react';

const MovieInfo = ({ movie }) => {
    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0" style={{ backgroundImage: `url(${movie.image_url})` }}>
            <div className="w-full h-1/2 bg-black bg-opacity-1 flex flex-col items-center justify-center rounded-lg">
                <img src={movie.image_url} alt={movie.title} className="w-48 h-auto rounded-lg" />
                <h1 className="text-6xl font-bold text-center mt-5">{movie.title}</h1>
                <p className="text-lg text-center max-w-xl mt-5">{movie.overview}</p>
                <p className="text-lg text-purple-500 font-bold mt-5">Rating: {movie.rating}</p>
                <div className="mt-10">
                    <button className="px-5 py-2 mr-5 border-none rounded-lg cursor-pointer bg-white text-purple-500">+ My List</button>
                </div>
            </div>
        </div>
    );
};

export default MovieInfo;
