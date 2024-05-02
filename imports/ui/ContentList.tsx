import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from './ContentItem';


interface ContentData {
  src: string;
  alt: string;
  rating: number;
}

interface ContentListProps {
  id: string;
  title: string;
  //children in the form of content items
  content: ContentData[];
}

const ContentList: React.FC<ContentListProps> = ({ id, title, content }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleContentCount, setVisibleContentCount] = useState(0);

  const handleRedirect = () => {
    navigate(`/${id}`); 
  };

  // Calculate the number of content panels that fit in the container
  const updateVisibleContent = () => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = 160 + 16; // Assuming each content pane is 160px wide and has 8px margin on each side
      const visibleContent = Math.floor(containerWidth / contentWidth);
      setVisibleContentCount(visibleContent);
    }
  };

  // Update visible content on resize
  useEffect(() => {
    window.addEventListener('resize', updateVisibleContent);
    updateVisibleContent(); // Initial update
    return () => {
      window.removeEventListener('resize', updateVisibleContent);
    };
  }, []);

  return (
    <div className="flex flex-col mb-8 bg-slate-500 rounded-lg overflow-hidden shadow-lg">
      <div className="flex justify-between items-center mb-5 text-base">
        <h1 className="font-bold text-2xl text-black leading-tight tracking-tight pl-4 pt-2">{title}</h1>
        <button onClick={handleRedirect} className="text-black text-lg bg-transparent border-none cursor-pointer hover:underline pr-4 pt-2">
          Show all
        </button>
      </div>
      <div ref={containerRef} className="flex justify-center items-start overflow-hidden">
      {React.Children.toArray(content.map(img => (
          <ContentItem key={img.alt} src={img.src} alt={img.alt} rating={img.rating} />
        ))).slice(0, visibleContentCount)}
      </div>
    </div>
  );
};

export default ContentList;
