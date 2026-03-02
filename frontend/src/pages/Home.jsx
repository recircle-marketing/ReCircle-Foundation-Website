import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SDGFlipCard from '../components/SDGFlipCard';
import ContactForm from '../components/ContactForm';
import { 
  heroContent, 
  aboutFoundation, 
  sdgCommitments, 
  focusAreasPreview, 
  impactStats,
  contactCTA,
  images 
} from '../data/mock';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.5)), url(${images.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 animate-fade-in whitespace-pre-line">
            {heroContent.title}
          </h1>
          <Link to="/get-involved">
            <button className="bg-cta-blue text-cta-text px-6 py-3 rounded-lg text-base font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl">
              Partner for Impact.
            </button>
          </Link>
        </div>
      </section>

      {/* About the Foundation */}
      <section className="py-20 bg-brand-offwhite">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>{aboutFoundation.intro}</p>
            <p>{aboutFoundation.mission}</p>
            <p>{aboutFoundation.approach}</p>
            <p className="font-semibold text-brand-blue">{aboutFoundation.goal}</p>
          </div>
          <div className="mt-8">
            <Link to="/about">
              <button className="bg-cta-blue text-cta-text px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <span>Know More</span>
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* SDG Commitments */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Our Commitment to
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-brand-blue mb-12 text-center">
            Global Sustainable Development Goals
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {sdgCommitments.map((sdg) => (
              <SDGFlipCard key={sdg.number} sdg={sdg} />
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-20 bg-gradient-to-b from-brand-offwhite to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Our Areas of Action
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {focusAreasPreview.map((area) => (
              <div 
                key={area.title}
                className="group h-64 perspective-1000 cursor-pointer"
              >
                <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-[#01298a] rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <img 
                      src={area.icon} 
                      alt={area.title}
                      className="w-16 h-16 mb-4 object-contain"
                    />
                    <h3 className="text-xl font-bold text-center">{area.title}</h3>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-xl p-6 flex items-center justify-center shadow-lg border-2 border-[#01298a] [transform:rotateY(180deg)]">
                    <p className="text-gray-700 text-center leading-relaxed">{area.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/focus-areas">
              <button className="bg-cta-blue text-cta-text px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <span>Learn More About Our Work</span>
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-brand-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            The real impact happens after the bin.
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mt-12">
            {impactStats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-brand-yellow mb-2">
                  {stat.number}
                </div>
                <p className="text-white/90 text-sm leading-relaxed">
                  {stat.description}
                </p>
              </div>
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

export default Home;
