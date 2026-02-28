import React, { useState } from 'react';

const FlipCard = ({ title, description, icon: Icon }) => {
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
        {/* Front */}
        <div className="flip-card-face flip-card-front absolute w-full h-full backface-hidden bg-gradient-to-br from-brand-blue/90 to-brand-blue rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
          {Icon && <Icon size={48} className="mb-4" />}
          <h3 className="text-xl font-bold text-center">{title}</h3>
        </div>

        {/* Back */}
        <div className="flip-card-face flip-card-back absolute w-full h-full backface-hidden bg-white rounded-xl p-6 flex items-center justify-center shadow-lg border-2 border-brand-blue rotate-y-180">
          <p className="text-gray-700 text-center leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
