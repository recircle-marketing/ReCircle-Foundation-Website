import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';
import { images } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <img 
              src={images.logo} 
              alt="ReCircle Foundation" 
              className="h-12 w-auto brightness-0 invert"
            />
            <p className="text-gray-400 text-sm">
              Building the social infrastructure behind India's circular future
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-brand-green transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/focus-areas" className="text-gray-400 hover:text-brand-green transition-colors">
                  Focus Areas
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.recircle.in/impact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-brand-green transition-colors"
                >
                  Impact
                </a>
              </li>
              <li>
                <Link to="/get-involved" className="text-gray-400 hover:text-brand-green transition-colors">
                  Get Involved
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} className="text-brand-green" />
                <span>info@recirclefoundation.org</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} className="text-brand-green" />
                <span>+91 (0) 000 000 0000</span>
              </li>
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={18} className="text-brand-green mt-1" />
                <span>Mumbai, India</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a 
                href="#" 
                className="text-gray-400 hover:text-brand-green transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-brand-green transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-brand-green transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ReCircle Foundation. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-brand-green text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-brand-green text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
