import React from 'react';
import { useNavigate } from 'react-router-dom';



  //how to import the images

/*   const images = [
    { src: './ExampleResources/sienfeld.jpg', alt: 'Seinfeld' },
    { src: './ExampleResources/friends.jpg', alt: 'Friends' },
    { src: './ExampleResources/007.jpg', alt: '007' },
    { src: './ExampleResources/planet-earth.jpeg', alt: 'Planet Earth' },
    { src: './ExampleResources/fresh-prince.jpg', alt: 'Fresh Prince' }
  ]; */

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
        <h1 className="ml-2.5 font-bold text-3xl text-white-800 leading-tight tracking-tight sm:text-3xl">{title}</h1>
        <button onClick={handleRedirect} className="mr-2.5 text-3xl bg-transparent border-none cursor-pointer">+</button>
      </div>
      <div className="flex justify-around items-center flex-nowrap">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className="m-2.5 max-w-[175px] max-h-[100px] h-auto object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
            style={{ flex: '0 0 calc(16.66% - 20px)' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentList;