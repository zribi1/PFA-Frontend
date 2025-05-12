
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled 
          ? "bg-white bg-opacity-90 backdrop-blur-md shadow-md py-2" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 animate-fade-in">
          <img src="public\images\LogoIIT.png"width={"60px"}/>
          <span className={cn(
            "font-bold text-lg transition-colors duration-300 text-brand-blue" 
          )}>
            Institut International de Technologie 
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 animate-fade-in">
          {['Accueil', 'Employées', "Demandes d'avances", 'Demandes Congés', 'Messageries'].map((item) => (
            <Link 
              key={item} 
              to={item === 'Accueil' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={cn(
                "font-medium hover:text-brand-yellow transition-colors duration-200 text-brand-blue" 
              )}
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Phone Number */}
        <div className="hidden md:flex items-center animate-fade-in">
          <a 
            href="tel:+21629342131" 
            className={cn(
              "flex items-center gap-2 font-medium text-brand-blue"
            )}
          >
            <Phone className="w-4 h-4" />
            <span>(+216) 74 46 50 20
            </span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-brand-blue z-50"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className={cn(
              "w-6 h-6 transition-colors duration-300",
              isScrolled ? "text-brand-blue" : "text-white"
            )} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-brand-blue bg-opacity-95 backdrop-blur-md z-40 animate-fade-in">
          <div className="flex flex-col h-full justify-center items-center">
            <nav className="flex flex-col items-center space-y-6">
            {['Accueil', 'Employées', "Demandes d'avances", 'Demandes Congés', 'Messageries'].map((item) => (
                <Link 
                  key={item} 
                  to={item === 'Accueil' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-white font-semibold text-xl hover:text-brand-yellow transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <a 
                href="tel:+21629342131" 
                className="flex items-center gap-2 text-white mt-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                <span>(+216) 74 46 50 20
                </span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
