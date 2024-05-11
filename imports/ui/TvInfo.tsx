import React from 'react';
import dummyTVs from './DummyTvs';

interface TvInfoProps {
    id: number;
    title: string;
    overview: string;
    image_url: string;
    first_aired: Date;
    last_aired: Date;
    seasons: string[];
}

const TvInfo = ({ tv }) => {
    return (
        <div className="flex flex-col items-center justify-end h-screen text-white bg-cover bg-center p-0 relative">
            {/* Background overlay */}
            <div className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${tv.image_url})` }}></div>
            
            {/* Main content */}
            <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center">
            <div className=" min-h-3/4 rounded-xl shadow-md md:max-w-4xl overflow-y-auto py-6 bg-black bg-opacity-100 text-white flex flex-row items-center justify-between px-5 h-auto w-full">
                    {/* Left column */}
                    <div className="flex flex-col items-start w-2/5 gap-4">
                        <img src={tv.image_url} alt={tv.title} className="w-full h-auto rounded-lg mb-5 ml-6" />
                        <button className="px-5 py-2 border-none rounded-lg cursor-pointer bg-white text-purple-500 mb-5 ml-6">+</button>
                    </div>
                    
                    {/* Right column */}
                    <div className="flex flex-col items-start w-1/2">
                    <h1 className="font-bold text-center text-5xl max-w-full overflow-hidden  whitespace-wrap">{tv.title}</h1>
                    <h6 className="text-2xl font-bold text-center max-w-full overflow-hidden whitespace-nowrap">({tv.first_aired.getFullYear().toString()} - {tv.last_aired.getFullYear().toString()})</h6>

                        <p className="text-2xl font-semibold text-center mt-5">SYNOPSIS</p>
                        <p className="text-lg text-center max-w-xl mt-5">{tv.overview}</p>
                        <p className="text-2xl font-semibold text-center mt-5">AGE RATING</p>
                        <p className="text-lg text-center max-w-xl mt-5">{tv.age_rating}</p>
                        <p className="text-2xl font-semibold text-center mt-5">RATING</p>
                        <p className="text-lg text-center max-w-xl mt-5">{tv.rating}</p>
                
                        <p className="text-2xl font-semibold text-center mt-5">SEASONS</p>
        
                    


                    
                        {/* Map through seasons and render */}
                        {tv.seasons.map((season, index) => (
                            <div key={index}>
                                <p className="text-lg font-bold text-center mt-5 flex items-center">{` ${season}`}<button className="ml-2 px-3 py-1 border-none rounded-full cursor-pointer bg-white text-purple-500">+</button></p>
                            </div>
                        ))} 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TvInfo;

