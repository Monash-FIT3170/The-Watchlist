import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from './ContentItem';

interface ContentItemData {
  image_url: string;  // Use image_url instead of src
  title: string;      // Use title as the alt text description
  rating: number;
}

interface ContentListProps {
  list: {
    listId: string;
    title: string;
    content: ContentItemData[];
  };
}

const ContentList: React.FC<ContentListProps> = ({ list }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleContentCount, setVisibleContentCount] = useState(0);

  const handleRedirect = () => {
    navigate(`/${list.listId}`);
  };

  // Calculate the number of content panels that fit in the container
  const updateVisibleContent = () => {
    const container = containerRef.current;
    if (container) {
      const containerWidth = container.offsetWidth;
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
    <div className="flex flex-col mb-8 bg-darker rounded-lg overflow-hidden shadow-lg">
      <div className="flex justify-between items-center mb-5 text-base">
        <h1 className="font-bold text-2xl text-white leading-tight tracking-tight pl-4 pt-2">{list.title}</h1>
        <button onClick={handleRedirect} className="text-white text-lg bg-transparent border-none cursor-pointer hover:underline pr-4 pt-2">
          Show all
        </button>
      </div>
      <div ref={containerRef} className="flex justify-flex-start items-start overflow-hidden">
        {React.Children.toArray(list.content.map((item, index) => (
          <ContentItem key={index} src={item.image_url} alt={item.title} rating={item.rating} />
        ))).slice(0, visibleContentCount)}
      </div>
    </div>
  );
};

export default ContentList;
