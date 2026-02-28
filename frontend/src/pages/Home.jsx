import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, 
  Users, 
  Package, 
  Heart, 
  Briefcase, 
  Shield,
  ArrowRight,
  Leaf,
  Building2,
  TreeDeciduous,
  ShoppingBag,
  Globe,
  Droplets,
  Handshake
} from 'lucide-react';
import FlipCard from '../components/FlipCard';
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

  const focusAreaIcons = {
    'WASTE DIVERSION': Recycle,
    'FORMALISATION OF SAFAI SAATHIS': Users,
    'WASTE INTO RESOURCES': Package,
    'BEHAVIOURAL CHANGE': Heart,
    'LIVELIHOOD OPPORTUNITIES': Briefcase,
    'HEALTH & SAFETY ACCESS': Shield
  };

  const sdgIcons = {
    '8': Briefcase,
    '9': Building2,
    '11': TreeDeciduous,
    '12': ShoppingBag,
    '13': Leaf,
    '14': Droplets,
    '17': Handshake
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(18, 152, 138, 0.85), rgba(18, 152, 138, 0.75)), url(${images.hero})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-8 animate-fade-in">
            {heroContent.title}
          </h1>
          <Link to="/get-involved">
            <button className="bg-white text-brand-blue px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-offwhite transition-all duration-300 hover:scale-105 shadow-xl">
              Partner With Us
            </button>
          </Link>
        </div>
      </section>

      {/* About the Foundation */}
      <section className="py-20 bg-brand-offwhite">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            About the Foundation
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>{aboutFoundation.intro}</p>
            <p>{aboutFoundation.mission}</p>
            <p>{aboutFoundation.approach}</p>
            <p className="font-semibold text-brand-blue">{aboutFoundation.goal}</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sdgCommitments.map((sdg) => {
              const Icon = sdgIcons[sdg.number];
              return (
                <div 
                  key={sdg.number}
                  className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-brand-blue text-white rounded-lg p-3 flex-shrink-0">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">
                        SDG {sdg.number} | {sdg.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {sdg.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
            {focusAreasPreview.map((area) => {
              const Icon = focusAreaIcons[area.title];
              return (
                <FlipCard 
                  key={area.title}
                  title={area.title}
                  description={area.description}
                  icon={Icon}
                />
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link to="/focus-areas">
              <button className="bg-brand-blue text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-brand-blue/90 transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl">
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
