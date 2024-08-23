import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentItem from './ContentItem';

const ContentListAI = ({ list, isUserOwned }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [visibleContentCount, setVisibleContentCount] = useState(0);

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
    <div className="flex flex-col mb-2 bg-transparent overflow-hidden shadow-none py-0 px-0">
      <div className="flex justify-between items-center mb-0 text-base">
<div className="font-bold text-2xl text-white leading-tight tracking-tight pl-2 bg-transparent border-none" 
        >{list.title}
        </div>
      </div>
      {list.content.length === 0 && (
          <div className="text-center text-gray-500 mt-2">
            {list.title} List is empty. Add your movies/TV shows.
          </div>
        )}
      <div ref={containerRef} className="flex justify-flex-start items-start overflow-hidden">
        {React.Children.toArray(list.content.map((item, index) => (
          <ContentItem 
            content={item}
            isUserSpecificRating={item.isUserSpecificRating}
          />
        ))).slice(0, visibleContentCount)}
      </div>
    </div>
  );
};

export default ContentListAI;
