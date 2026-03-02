import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const logoWhite = "https://customer-assets.emergentagent.com/job_impact-circularity/artifacts/3vh0qceb_ReCircle-Foundation-Logo-WHITE.png";
  
  return (
    <footer className="bg-[#01298a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <img 
              src={logoWhite} 
              alt="ReCircle Foundation" 
              className="h-12 w-auto"
            />
            <p className="text-white/80 text-sm">
              Building the social infrastructure behind India's circular future
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-brand-yellow transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/80 hover:text-brand-yellow transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/focus-areas" className="text-white/80 hover:text-brand-yellow transition-colors">
                  Focus Areas
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.recircle.in/impact" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-brand-yellow transition-colors"
                >
                  Impact
                </a>
              </li>
              <li>
                <Link to="/get-involved" className="text-white/80 hover:text-brand-yellow transition-colors">
                  Get Involved
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-white/80">
                <Mail size={18} className="text-brand-yellow" />
                <span>info@recirclefoundation.org</span>
              </li>
              <li className="flex items-center space-x-3 text-white/80">
                <Phone size={18} className="text-brand-yellow" />
                <span>+91 90042 40004</span>
              </li>
              <li className="flex items-start space-x-3 text-white/80">
                <MapPin size={18} className="text-brand-yellow mt-1" />
                <span>Mumbai, India</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a 
                href="https://in.linkedin.com/company/recircleindia" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-brand-yellow transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://www.facebook.com/recircle.in/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-brand-yellow transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.instagram.com/recircle.in/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-brand-yellow transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm">
            © {new Date().getFullYear()} ReCircle Foundation. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="text-white/80 hover:text-brand-yellow text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/80 hover:text-brand-yellow text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
