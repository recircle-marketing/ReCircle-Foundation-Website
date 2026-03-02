import React, { useEffect, useRef } from 'react';
import ContactForm from '../components/ContactForm';
import { focusAreasIntro, focusAreasDetailed, contactCTA, images } from '../data/mock';

const FocusAreas = () => {
  const contactFormRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const focusAreaImages = {
    'WASTE DIVERSION': images.wasteDiversion,
    'FORMALISATION OF SAFAI SAATHIS': images.formalisation,
    'TURNING WASTE INTO RESOURCES': images.wasteResources,
    'DRIVING BEHAVIORAL CHANGE': images.behavioralChange,
    'SECURING LIVELIHOOD OPPORTUNITIES': images.livelihood,
    'HEALTH & SAFETY ACCESS': images.healthSafety
  };

  return (
    <div className="pt-20">
      {/* Hero/Intro Section */}
      <section 
        className="relative py-48 bg-cover bg-center min-h-[85vh]"
        style={{
          backgroundImage: `url(${images.focusAreasHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-white">
              {focusAreasIntro.title}
            </h1>
            <p className="text-xl mb-4 text-white/90">
              {focusAreasIntro.description}
            </p>
            <p className="text-lg font-semibold text-brand-yellow">
              {focusAreasIntro.conclusion}
            </p>
          </div>
        </div>
      </section>

      {/* Focus Areas Detail */}
      <section className="py-12">
        {focusAreasDetailed.map((area, index) => {
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
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                      {area.title}
                    </h2>
                    
                    <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line">
                      {area.content}
                    </div>
                    
                    <button 
                      onClick={scrollToContactForm}
                      className="mt-8 bg-cta-blue text-cta-text px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {area.cta.replace('.', '').replace('!', '')}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-[#01298a]/30 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Contact CTA */}
      <section ref={contactFormRef} className="py-20 bg-brand-offwhite scroll-mt-20">
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
