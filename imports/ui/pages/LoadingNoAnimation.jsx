import React, { useState, useEffect } from 'react';
import { GiPopcorn } from 'react-icons/gi';

const LoadingNoAnimation = ({ pageName, pageDesc, upperScreen }) => {
  const [description, setDescription] = useState(pageDesc);
  const [failLoad, setFailedLoad] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDescription('No content found');
      setFailedLoad(true)
    }, 15000);

    return () => clearTimeout(timer); 
  }, []);

  

  return (
    <div 
      className={`flex flex-col items-center ${
        upperScreen ? 'justify-start pt-36' : 'justify-center'
      } h-screen bg-darker text-purplish-grey`}
    >
      <div className="flex justify-center mb-4 mt-14">
        <GiPopcorn className={`text-9xl text-yellow-500 ${ !failLoad ? 'animate-jiggle': ''}`}/>
      </div>
      <p className="text-2xl font-bold font-anton text-center">
        {description}
      </p>
    </div>
  );
};

export default LoadingNoAnimation;