import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Image {
  src: string;
  alt: string;
}

interface ContentListProps {
  title: string;
  images: Image[];
}

const ContentList: React.FC<ContentListProps> = ({ title, images }) => {
  let navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/profile'); // Adjust as necessary for actual routing
  };

  return (
    <div className="flex flex-col mt-12">
      <div className="flex justify-between items-center mb-5 text-base">
        <h1 className="ml-2.5 font-bold text-3xl text-white leading-tight tracking-tight sm:text-3xl">{title}</h1>
        <button onClick={handleRedirect} className="mr-2.5 text-3xl bg-transparent border-none cursor-pointer">+</button>
      </div>
      <div className="flex justify-start items-start flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="flex flex-col items-start">  
            <img
              src={image.src}
              alt={image.alt}
              className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
              style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div className="text-white mt-2 text-left">{image.alt}</div>  
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentList;
