import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Menu, X, UserCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Accueil', path: '/' },
  { label: 'Employées', path: '/employées' },
  { label: "Demandes d'avances", path: '/demandes-d-avances' },
  { label: 'Demandes Congés', path: '/demandes-congés' },
  { label: 'Absences', path: '/absences' }, 
  { label: 'Messageries', path: '/messageries' },
  { label: 'Annonces', path: '/annonces' }
];


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Déconnexion");
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        isScrolled ? "bg-white bg-opacity-90 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 animate-fade-in">
          <img src="/images/LogoIIT.png" width="60" alt="Logo IIT" />
          <span className="font-bold text-lg text-brand-blue">
            Institut International de Technologie
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 animate-fade-in">
          {NAV_ITEMS.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="font-medium hover:text-brand-yellow transition-colors duration-200 text-brand-blue"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Profile Dropdown (Desktop) */}
        <div className="relative hidden md:block" ref={profileRef}>
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 text-brand-blue">
            <UserCircle className="w-7 h-7" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border p-4 z-50">
              <p className="font-semibold text-gray-800">{user?.prenom} {user?.nom}</p>
              <p className="text-sm text-gray-600 truncate">{user?.email}</p>
              <button
                onClick={handleLogout}
                className="mt-4 w-full flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-brand-blue z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu
              className={cn(
                "w-6 h-6 transition-colors duration-300",
                isScrolled ? "text-brand-blue" : "text-white"
              )}
            />
          )}
        </button>
      </div>

      {/* Mobile Fullscreen Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-brand-blue bg-opacity-95 backdrop-blur-md z-40 animate-fade-in">
          <div className="flex flex-col h-full justify-center items-center">
            <nav className="flex flex-col items-center space-y-6">
              {NAV_ITEMS.map(({ label, path }, index) => (
                <Link
                  key={label}
                  to={path}
                  className="text-white font-semibold text-xl hover:text-brand-yellow transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <a
                href="tel:+21674465020"
                className="flex items-center gap-2 text-white mt-6"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Phone className="w-5 h-5" />
                <span>(+216) 74 46 50 20</span>
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
