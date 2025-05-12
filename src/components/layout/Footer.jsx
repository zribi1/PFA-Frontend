import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-blue text-white pt-16 pb-8 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-brand-yellow text-brand-blue font-bold flex items-center justify-center text-xl">
                I
              </div>
              <span className="font-bold text-xl">IIT Sfax</span>
            </div>
            <p className="text-gray-300 mb-4">
              Plateforme RH N°1 en Tunisie. Gérez vos employés, leurs congés, évaluations et recrutements avec facilité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-brand-yellow transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Services RH</h3>
            <ul className="space-y-2">
              {['Gestion des employés', 'Recrutement', 'Évaluations de performance', 'Gestion des congés', 'Gestion des absences', 'Formation continue'].map((service) => (
                <li key={service}>
                  <Link to="#" className="text-gray-300 hover:text-brand-yellow transition-colors">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Liens Rapides</h3>
            <ul className="space-y-2">
              {[ 
                { name: 'Accueil', path: '/' }, 
                { name: 'Gérer les employés', path: '/gerer-employes' },
                { name: 'Recrutement', path: '/recrutement' },
                { name: 'Congés et absences', path: '/conges-absences' },
                { name: 'Évaluations', path: '/evaluations' },
                { name: 'À propos', path: '/a-propos' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-300 hover:text-brand-yellow transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                <span className="text-gray-300">15 Rue de Tunis, Ariana, Tunisie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-yellow shrink-0" />
                <a href="tel:+21629342131" className="text-gray-300 hover:text-brand-yellow transition-colors">
                  (+216) 29 342 131
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-yellow shrink-0" />
                <a href="mailto:contact@iitsfax.tn" className="text-gray-300 hover:text-brand-yellow transition-colors">
                  contact@iitsfax.tn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
            © {new Date().getFullYear()} IIT Sfax. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
