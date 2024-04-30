import React from 'react';

const FullContentList = ({ title, images }) => {
    const repeatedImages = Array.from({ length: 20 }, () => images).flat();

    const content = repeatedImages.map((image, index) => (
        <div key={index} className="flex flex-col items-center w-1/6 p-2">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto object-cover rounded-lg"
          />
          <span className="text-white mt-2 text-sm font-bold">{image.alt}</span>
        </div>
    ));

    return (
        <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <div className="flex flex-wrap justify-center items-start mt-4">
              {content}
            </div>
        </div>
    );
};

export default FullContentList;
