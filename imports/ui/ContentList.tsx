import React, { useRef, useState, useEffect } from 'react';
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
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleImagesCount, setVisibleImagesCount] = useState(0);

  const handleRedirect = () => {
    navigate('/profile'); // Adjust as necessary for actual routing
  };

  // Calculate the number of images that fit in the container
  const updateVisibleImages = () => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = containerRef.current.offsetWidth;
      const imageWidth = 160 + 16; // Assuming each image is 160px wide and has 8px margin on each side
      const visibleImages = Math.floor(containerWidth / imageWidth);
      setVisibleImagesCount(visibleImages);
    }
  };

  // Update visible images on resize
  useEffect(() => {
    window.addEventListener('resize', updateVisibleImages);
    updateVisibleImages(); // Initial update
    return () => {
      window.removeEventListener('resize', updateVisibleImages);
    };
  }, []);

  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between items-center mb-5 text-base">
        <h1 className="font-bold text-2xl text-white leading-tight tracking-tight">{title}</h1>
        <button onClick={handleRedirect} className="text-lg bg-transparent border-none cursor-pointer hover:underline">
          Show all
        </button>
      </div>
      <div ref={containerRef} className="flex justify-start items-start overflow-hidden">
        {images.slice(0, visibleImagesCount).map((image, index) => (
          <div key={index} className="flex flex-col items-start mr-4">
            <img
              src={image.src}
              alt={image.alt}
              className="transition-transform duration-200 ease-in-out transform hover:scale-110 cursor-pointer"
              style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '8px', margin: '8px' }}
            />
            <div className="text-white mt-2 text-left">{image.alt}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentList;
