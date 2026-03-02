import React, { useState } from 'react';

const SDGFlipCard = ({ sdg }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="flip-card-container h-64 perspective cursor-pointer"
      onMouseEnter={() => window.innerWidth >= 768 && setIsFlipped(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsFlipped(false)}
      onClick={() => window.innerWidth < 768 && handleFlip()}
    >
      <div 
        className={`flip-card-inner relative w-full h-full transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front - SDG Icon edge-to-edge */}
        <div className="flip-card-face flip-card-front absolute w-full h-full backface-hidden rounded-xl overflow-hidden shadow-lg">
          <img 
            src={sdg.icon} 
            alt={`SDG ${sdg.number}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Back - Content */}
        <div className="flip-card-face flip-card-back absolute w-full h-full backface-hidden bg-white rounded-xl p-6 flex flex-col justify-center shadow-lg border-2 border-brand-blue rotate-y-180">
          <div className="text-center">
            <h4 className="font-bold text-gray-900 mb-3">
              SDG {sdg.number} | {sdg.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              {sdg.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDGFlipCard;
