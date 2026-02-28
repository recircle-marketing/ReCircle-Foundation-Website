import React from 'react';

const TeamCard = ({ name, designation, image }) => {
  return (
    <div className="group">
      <div className="relative overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
        <img 
          src={image} 
          alt={name}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="text-brand-blue mt-1">{designation}</p>
      </div>
    </div>
  );
};

export default TeamCard;
