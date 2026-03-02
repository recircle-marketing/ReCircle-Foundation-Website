import React from 'react';

const CorePillarCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-[#01298a] rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="inline-block text-[#deed4b] mb-4">
        <Icon size={48} />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">
        {title}
      </h3>
      <p className="text-white/90 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

export default CorePillarCard;
