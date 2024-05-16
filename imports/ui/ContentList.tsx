import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from './ContentItem';

interface ContentItemData {
  image_url: string;  // Use image_url instead of src
  title: string;      // Use title as the alt text description
  rating: number;
  content_id: number;
  type: string;
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
    <div className="flex flex-col mb-2 bg-darker rounded-lg overflow-hidden shadow-lg py-5 px-2">
      <div className="flex justify-between items-center mb-2 text-base">
      <button
        onClick={handleRedirect} // Same click handler as "Show all"
        className="font-bold text-2xl text-white leading-tight tracking-tight pl-2 hover:underline cursor-pointer bg-transparent border-none" // Styling to make it look like the original h1 plus hover effect
      >
        {list.title}
      </button>
        <button onClick={handleRedirect} className="text-gray-400 text-base bg-transparent border-none cursor-pointer hover:underline pr-4 pt-2">
          Show all
        </button>
      </div>
      <div ref={containerRef} className="flex justify-flex-start items-start overflow-hidden">
        {React.Children.toArray(list.content.map((item, index) => (
          <ContentItem key={index} id={item.content_id} type={item.type} src={item.image_url} alt={item.title} rating={item.rating} />
        ))).slice(0, visibleContentCount)}
      </div>
    </div>
  );
};

export default ContentList;
