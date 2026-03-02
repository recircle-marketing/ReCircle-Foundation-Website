import React, { useEffect } from 'react';
import { Mail, Phone, Building } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { getInvolvedHero, images } from '../data/mock';

const GetInvolved = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section 
        className="relative py-48 bg-cover bg-center min-h-[85vh]"
        style={{
          backgroundImage: `url(${images.getInvolvedHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl text-left">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              {getInvolvedHero.title}
            </h1>
            <p className="text-xl mb-6 text-white/90">
              {getInvolvedHero.description}
            </p>
            <p className="text-lg font-semibold text-brand-yellow">
              {getInvolvedHero.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-brand-offwhite rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#01298a]/20">
              <div className="inline-block bg-[#01298a] text-white rounded-full p-5 mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">info@recirclefoundation.org</p>
            </div>

            <div className="bg-brand-offwhite rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#01298a]/20">
              <div className="inline-block bg-[#01298a] text-white rounded-full p-5 mb-4">
                <Phone size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 (0) 000 000 0000</p>
            </div>

            <div className="bg-brand-offwhite rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#01298a]/20">
              <div className="inline-block bg-[#01298a] text-white rounded-full p-5 mb-4">
                <Building size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Mumbai, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-brand-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Let's Create Impact Together
          </h2>
          <p className="text-lg text-gray-700 mb-12 text-center">
            Fill out the form below and we'll get back to you within 24 hours.
          </p>
          
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default GetInvolved;
