import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { navigationLinks, images } from '../data/mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (link) => {
    if (link.external) {
      window.open(link.path, '_blank', 'noopener,noreferrer');
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src={images.logo} 
              alt="ReCircle Foundation" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-12">
            {navigationLinks.map((link) => {
              const isActive = link.path === location.pathname;
              return link.external ? (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="text-gray-700 hover:text-brand-blue font-medium transition-colors duration-200 relative group whitespace-nowrap"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-blue transition-all duration-200 group-hover:w-full"></span>
                </button>
              ) : (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-medium transition-colors duration-200 relative group whitespace-nowrap ${
                    isActive ? 'text-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-brand-blue transition-all duration-200 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-brand-blue transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigationLinks.map((link) => {
                const isActive = link.path === location.pathname;
                return link.external ? (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    className="text-left text-gray-700 hover:text-brand-blue font-medium transition-colors duration-200 py-2"
                  >
                    {link.name}
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`font-medium transition-colors duration-200 py-2 ${
                      isActive ? 'text-brand-blue' : 'text-gray-700 hover:text-brand-blue'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
