import React, { useEffect } from 'react';
import { Recycle, Users, Package, Heart, Briefcase, Shield, ArrowRight } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { focusAreasIntro, focusAreasDetailed, contactCTA, images } from '../data/mock';

const FocusAreas = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const focusAreaIcons = {
    'WASTE DIVERSION': Recycle,
    'FORMALISATION OF SAFAI SAATHIS': Users,
    'TURNING WASTE INTO RESOURCES': Package,
    'DRIVING BEHAVIORAL CHANGE': Heart,
    'SECURING LIVELIHOOD OPPORTUNITIES': Briefcase,
    'HEALTH & SAFETY ACCESS': Shield
  };

  const focusAreaImages = {
    'WASTE DIVERSION': images.hero,
    'FORMALISATION OF SAFAI SAATHIS': images.hero,
    'TURNING WASTE INTO RESOURCES': images.wasteResources,
    'DRIVING BEHAVIORAL CHANGE': images.communityEducation,
    'SECURING LIVELIHOOD OPPORTUNITIES': images.hero,
    'HEALTH & SAFETY ACCESS': images.hero
  };

  return (
    <div className="pt-20">
      {/* Hero/Intro Section */}
      <section className="py-20 bg-gradient-to-br from-brand-blue to-brand-green text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight whitespace-pre-line">
            {focusAreasIntro.title}
          </h1>
          <p className="text-xl mb-4 text-white/90">
            {focusAreasIntro.description}
          </p>
          <p className="text-lg font-semibold text-brand-yellow">
            {focusAreasIntro.conclusion}
          </p>
        </div>
      </section>

      {/* Focus Areas Detail */}
      <section className="py-12">
        {focusAreasDetailed.map((area, index) => {
          const Icon = focusAreaIcons[area.title];
          const bgColor = index % 2 === 0 ? 'bg-white' : 'bg-brand-offwhite';
          const imageUrl = focusAreaImages[area.title];
          
          return (
            <div key={area.id} className={`${bgColor} py-16`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}>
                  {/* Content */}
                  <div className={index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="bg-brand-blue text-white rounded-lg p-4">
                        <Icon size={32} />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {area.title}
                      </h2>
                    </div>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line">
                      {area.content}
                    </div>
                    
                    <button className="mt-8 bg-brand-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-blue/90 transition-all duration-300 inline-flex items-center space-x-2 shadow-md hover:shadow-lg">
                      <span>{area.cta}</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Image */}
                  <div className={index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}>
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 lg:h-96">
                      <img 
                        src={imageUrl} 
                        alt={area.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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

export default FocusAreas;
