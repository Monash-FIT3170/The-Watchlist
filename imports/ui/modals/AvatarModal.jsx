import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AvatarModal = ({ handleAvatarChange, handlePresetAvatarSelect, setShowAvatarModal }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const canvasRef = useRef(null);

  const expressions = [
    { id: "face1", label: "1", image: "/images/face1.png" }, 
    { id: "face2", label: "2", image: "/images/face2.png" }
  ];

  useEffect(() => {
    renderToCanvas();
  }, [selectedIndex]);

  const renderToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const faceImage = new Image();
    faceImage.src = expressions[selectedIndex].image;

    faceImage.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(faceImage, 0, 0, canvas.width, canvas.height);
    };
  };

  const handleNext = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % expressions.length);
    renderToCanvas();
  };

  const handlePrevious = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + expressions.length) % expressions.length); 
    renderToCanvas(); 
  };

  const handleSaveAvatar = () => {
    const canvas = canvasRef.current;
    
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "avatar.png", { type: "image/png" });
        handleAvatarChange(file);
      }
    });
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-zinc-700 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-bold mb-4 text-center">Customize Your Avatar</h3>

        {/* Avatar preview */}
        <div className="flex justify-center items-center mb-4">
          {/* Left arrow */}
          <button onClick={handlePrevious} className="text-white text-2xl p-2">
            <FaArrowLeft />
          </button>

          {/* Canvas element to draw the selected face */}
          <canvas ref={canvasRef} width="128" height="128" className="mx-4 border rounded-full"></canvas>

          {/* Right arrow */}
          <button onClick={handleNext} className="text-white text-2xl p-2">
            <FaArrowRight />
          </button>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleSaveAvatar}
          >
            Save
          </button>
        </div>

        {/* Cancel button */}
        <div className="flex justify-end mt-2">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={() => setShowAvatarModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarModal;
