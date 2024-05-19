import React, { useState, useEffect, useRef } from 'react';

const Scrollbar = ({ children, className = '' }) => {
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
      }, 1000); // Adjust the time (in milliseconds) to hide the scrollbar after user stops scrolling
    };

    const scrollableElement = scrollRef.current;
    scrollableElement.addEventListener('scroll', handleScroll);

    return () => {
      scrollableElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      className={`${className} relative overflow-y-auto scrollbar-webkit ${isScrolling ? '' : 'scrollbar-hidden'}`}
      style={{ paddingRight: '8px', boxSizing: 'content-box' }}
    >
      {children}
    </div>
  );
};

export default Scrollbar;