import React, { useState, useRef, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const AvatarModal = ({ handleAvatarChange, setShowAvatarModal }) => {
  const [selectedFaceIndex, setSelectedFaceIndex] = useState(0);
  const [selectedHairIndex, setSelectedHairIndex] = useState(0);
  const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState(0);
  const canvasRef = useRef(null);

  const expressions = [
    { id: "face1", label: "1", image: "/images/frown.png" },
    { id: "face2", label: "2", image: "/images/grr.png" },
    { id: "face3", label: "2", image: "/images/smile.png" },
    { id: "face4", label: "2", image: "/images/smirk.png" }
  ];

  const hairstyles = [
    { id: "hair1", label: "1", image: "/images/short.png" },
    { id: "hair2", label: "2", image: "/images/long.png" },
    { id: "hair3", label: "2", image: "/images/spiky.png" }
  ];

  const backgrounds = [
    { id: "bg1", label: "1", image: "/images/orangebg.png" },
    { id: "bg2", label: "2", image: "/images/greenbg.png" },
    { id: "bg3", label: "3", image: "/images/pinkbg.png" }
  ];

  useEffect(() => {
    renderToCanvas();
  }, [selectedFaceIndex, selectedHairIndex, selectedBackgroundIndex]);

  const renderToCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const faceImage = new Image();
    faceImage.src = expressions[selectedFaceIndex].image;

    const hairImage = new Image();
    hairImage.src = hairstyles[selectedHairIndex].image;

    const backgroundImage = new Image();
    backgroundImage.src = backgrounds[selectedBackgroundIndex].image;

    // Load all images using Promise.all
    Promise.all([
      new Promise((resolve) => (backgroundImage.onload = resolve)),
      new Promise((resolve) => (faceImage.onload = resolve)),
      new Promise((resolve) => (hairImage.onload = resolve))
    ]).then(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the background first
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

      // Face scaling and aspect ratio calculation
      const faceScale = 0.8; 
      const faceAspectRatio = faceImage.width / faceImage.height;
      let faceWidth, faceHeight;

      if (canvas.width / canvas.height > faceAspectRatio) {
        faceHeight = canvas.height * faceScale;
        faceWidth = faceHeight * faceAspectRatio;
      } else {
        faceWidth = canvas.width * faceScale;
        faceHeight = faceWidth / faceAspectRatio;
      }

      const faceXOffset = (canvas.width - faceWidth) / 2;
      const faceYOffset = (canvas.height - faceHeight) / 2;
      ctx.drawImage(faceImage, faceXOffset, faceYOffset, faceWidth, faceHeight);

      // Hair scaling and aspect ratio preservation
      const hairScale = 0.9;
      const hairAspectRatio = hairImage.width / hairImage.height;
      let hairWidth, hairHeight;

      if (canvas.width / canvas.height > hairAspectRatio) {
        hairHeight = (canvas.height * hairScale);
        hairWidth = hairHeight * hairAspectRatio;
      } else {
        hairWidth = (canvas.width * hairScale);
        hairHeight = hairWidth / hairAspectRatio;
      }

      const hairXOffset = (canvas.width - hairWidth) / 2;
      const hairYOffset = (canvas.height - hairHeight) / 2 - hairHeight / 3.9;
      ctx.drawImage(hairImage, hairXOffset, hairYOffset, hairWidth, hairHeight);
    });
  };

  const handleNextFace = () => {
    setSelectedFaceIndex((prevIndex) => (prevIndex + 1) % expressions.length);
  };

  const handlePreviousFace = () => {
    setSelectedFaceIndex((prevIndex) => (prevIndex - 1 + expressions.length) % expressions.length);
  };

  const handleNextHair = () => {
    setSelectedHairIndex((prevIndex) => (prevIndex + 1) % hairstyles.length);
  };

  const handlePreviousHair = () => {
    setSelectedHairIndex((prevIndex) => (prevIndex - 1 + hairstyles.length) % hairstyles.length);
  };

  const handleNextBackground = () => {
    setSelectedBackgroundIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
  };

  const handlePreviousBackground = () => {
    setSelectedBackgroundIndex((prevIndex) => (prevIndex - 1 + backgrounds.length) % backgrounds.length);
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
          {/* Left arrow for face */}
          <button onClick={handlePreviousFace} className="text-white text-2xl p-2">
            <FaArrowLeft />
          </button>

          {/* Canvas element to draw the selected face, hairstyle, and background */}
          <canvas ref={canvasRef} width="128" height="128" className="mx-4 border rounded-full"></canvas>

          {/* Right arrow for face */}
          <button onClick={handleNextFace} className="text-white text-2xl p-2">
            <FaArrowRight />
          </button>
        </div>

        {/* Hairstyle controls */}
        <div className="flex justify-center items-center mb-4">
          <button onClick={handlePreviousHair} className="text-white text-2xl p-2">
            <FaArrowLeft />
          </button>
          <span className="text-white mx-2">Choose Hairstyle</span>
          <button onClick={handleNextHair} className="text-white text-2xl p-2">
            <FaArrowRight />
          </button>
        </div>

        {/* Background controls */}
        <div className="flex justify-center items-center mb-4">
          <button onClick={handlePreviousBackground} className="text-white text-2xl p-2">
            <FaArrowLeft />
          </button>
          <span className="text-white mx-2">Choose Background</span>
          <button onClick={handleNextBackground} className="text-white text-2xl p-2">
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
