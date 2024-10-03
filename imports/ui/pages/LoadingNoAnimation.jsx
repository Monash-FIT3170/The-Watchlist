import React from 'react';
import { GiPopcorn } from 'react-icons/gi'

const LoadingNoAnimation = ({ pageName, pageDesc, upperScreen}) => {
    

  return (
    <div 
    className={`flex flex-col items-center ${
      upperScreen ? 'justify-start  pt-36' : 'justify-center'
    } h-screen bg-darker text-purplish-grey`}
  >
      
      <div className="flex justify-center mb-4 mt-14">
        <GiPopcorn className="text-9xl text-yellow-500 animate-jiggle" />
      </div>


      <p className="text-2xl font-bold font-anton text-center">
        {pageDesc}
      </p>
    </div>
  );
};

export default LoadingNoAnimation;