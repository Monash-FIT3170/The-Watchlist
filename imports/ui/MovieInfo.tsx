import React from 'react';
{/* <div className="w-full h-3/4 bg-black bg-opacity-1 rounded-xl shadow-md overflow-hidden md:max-w-4xl flex flex-col items-center justify-center"> */}

const MovieInfo = ({ movie }) => {
    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative">
        <div className="absolute inset-0 w-full h-full bg-center bg-cover" style={{ backgroundImage: `url(${movie.image_url})`, opacity: 0.3 }}></div>
        <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            <div className="w-full h-3/4 rounded-xl shadow-md overflow-hidden md:max-w-4xl bg-black bg-opacity-100 text-white flex flex-col items-center justify-center">
                <img src={movie.image_url} alt={movie.title} className="w-48 h-auto rounded-lg" />
                <h1 className="text-6xl font-bold text-center mt-5">{movie.title}</h1>
                <p className="text-lg text-center max-w-xl mt-5">{movie.overview}</p>
                <p className="text-lg text-purple-500 font-bold mt-5">Rating: {movie.rating}</p>
                <div className="mt-10">
                    <button className="px-5 py-2 mr-5 border-none rounded-lg cursor-pointer bg-white text-purple-500">+ My List</button>
                </div>
            </div>
        </div>
    </div>
    );
};

export default MovieInfo;
