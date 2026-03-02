import React, { useEffect } from 'react';
import CorePillarCard from '../components/CorePillarCard';
import TeamCard from '../components/TeamCard';
import ContactForm from '../components/ContactForm';
import { 
  aboutPageHero, 
  aboutPageContent, 
  visionItems,
  corePillars,
  teamMembers,
  contactCTA,
  images
} from '../data/mock';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="relative py-40 bg-cover bg-center min-h-[70vh]"
        style={{
          backgroundImage: `url(${images.aboutMission})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#01298a]/85 to-[#01298a]/75"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl text-left">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {aboutPageHero.title}
            </h1>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-brand-offwhite">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>{aboutPageContent.founded}</p>
            <p>{aboutPageContent.story}</p>
            <p>{aboutPageContent.commitment}</p>
            <p className="font-semibold text-brand-blue">{aboutPageContent.conclusion}</p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Vision
          </h2>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-4xl mx-auto">
            Recircle Foundation was built to create an ethical circular economy that:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visionItems.map((item) => (
              <div 
                key={item.title}
                className="bg-brand-offwhite border-2 border-brand-blue/20 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="inline-block mb-4">
                  <img 
                    src={item.icon} 
                    alt={item.title}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-gradient-to-b from-brand-offwhite to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Core Pillars
          </h2>
          <h3 className="text-xl text-brand-blue mb-12 text-center">
            The Principles That Shape Our Work
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {corePillars.map((pillar) => (
              <CorePillarCard
                key={pillar.title}
                title={pillar.title}
                description={pillar.description}
                icon={pillar.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Meet our impact champions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <TeamCard 
                key={member.name}
                name={member.name}
                designation={member.designation}
                image={member.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-brand-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            {contactCTA.title}
          </h2>
          <p className="text-lg text-gray-700 mb-12 text-center">
            {contactCTA.description}
          </p>
          
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default About;
