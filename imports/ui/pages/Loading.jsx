import React from 'react';

const Loading = ({ pageName }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500 mb-4"></div>
      <p className="text-xl font-semibold">Loading {pageName}...</p>
      <p className="text-gray-400 mt-2">Please wait a moment while we fetch your content.</p>
    </div>
  );
};

export default Loading;
