import React, { useState, useEffect, useRef } from 'react';

const Scrollbar = ({ children, className = '', backgroundColor = '#FFFFFF', horizontal = false }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollRef.current) {
        clearTimeout(scrollRef.current);
      }
      scrollRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1000); // Adjust the time (in milliseconds) to change the color of the scrollbar thumb after user stops scrolling
    };

    const scrollableElement = scrollRef.current;
    scrollableElement.addEventListener('scroll', handleScroll);

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`${className} relative overflow-${horizontal ? 'x-auto' : 'y-auto'} scrollbar-webkit`}
      style={{
        overflowY: horizontal ? 'hidden' : 'auto',
        overflowX: horizontal ? 'auto' : 'hidden',
        paddingRight: '0',
        boxSizing: 'border-box', // Changed to 'border-box'
        '--scrollbar-thumb-color': isScrolling ? "#808080" : "#101010",
        '--scrollbar-thumb-bg': backgroundColor,
      }}
      
    >
      {children}
      <style>{`
        .scrollbar-webkit::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .scrollbar-webkit::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-webkit::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb-color);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default Scrollbar;
