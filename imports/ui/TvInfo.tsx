import React from 'react';


const TvInfo = ({ tv }) => {
    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative">
            {/* Background overlay */}
            <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${tv.image_url})`, filter: "blur(9px)" }}></div>
            {/* Main content */}
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            <div className="min-h-3/4 rounded-xl shadow-lg md:max-w-3xl overflow-y-auto py-6 bg-black bg-opacity-100 text-white flex flex-row items-center justify-between px-5 h-auto w-full" style={{ boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.4)' }}>
                    {/* Left column */}
                    <div className="flex flex-col items-start w-2/5 gap-4">
                        <img src={tv.image_url} alt={tv.title} className="w-full h-auto rounded-lg mb-5 ml-6" />
                        <div className="flex items-center">
                        <p className="text-xl font-semibold text-center  mr-2">ADD TO LIST: </p>
                        <button className="px-5 py-2 border-none rounded-lg cursor-pointer bg-white text-purple-500 ">+</button>
                        </div>
                   </div>
                    
                    {/* Right column */}
                    <div className="flex flex-col items-start w-1/2">
                    <h1 className="font-bold font-famil text-center text-5xl max-w-full overflow-hidden  whitespace-wrap">{tv.title}</h1>
                    <h6 className="text-2xl font-bold text-center max-w-full overflow-hidden whitespace-nowrap">({tv.first_aired.getFullYear().toString()} - {tv.last_aired.getFullYear().toString()})</h6>

                        <p className="text-2xl font-semibold text-center mt-5">SYNOPSIS</p>
                        <p className="text-lg text-center max-w-xl mt-5">{tv.overview}</p>
                        <p className="text-2xl font-semibold text-center mt-5">GENRES</p>
                        <div className="text-lg text-center max-w-xl mt-5">
                            {tv.genres.map((genre, index) => (
                            <span key={index} className="mr-2">
                                {genre}
                                {index < tv.genres.length - 1 && ','}
                            </span>
                            ))}
                        </div>
                        {/* <p className="text-2xl font-semibold text-center mt-5">RATING</p>
                        <p className="text-lg text-center max-w-xl mt-5">{tv.rating}</p> */}
                
                <p className="text-2xl font-semibold text-center mt-5">SEASONS</p>
                <div>
                    {tv.seasons.map((season, index) => (
                    <div key={index} className="mt-5 flex justify-center items-center">
                        <p className="text-lg font-bold">{`Season ${season.season_number}`}</p>
                        <button className="ml-2 px-3 py-1 border-none rounded-full cursor-pointer bg-white text-purple-500">+</button>
                    </div>
                    ))}
                </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default TvInfo;

