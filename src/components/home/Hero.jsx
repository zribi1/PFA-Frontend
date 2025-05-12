import React, { useEffect, useState } from 'react';
import SearchBar from '../ui/SearchBar';
import axios from 'axios';

const Hero = () => {
  const [stats, setStats] = useState({
    prestataires: 0,
    clients: 0,
    services: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, servicesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/users'),
          axios.get('http://localhost:8000/api/services')
        ]);

        const users = usersRes.data;
        const services = servicesRes.data;

        const prestatairesCount = users.filter(u => u.role === 'prestataire').length;
        const clientsCount = users.filter(u => u.role === 'client').length;
        const servicesCount = services.length;

        setStats({
          prestataires: prestatairesCount,
          clients: clientsCount,
          services: servicesCount
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des stats :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="relative bg-brand-blue min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
          backgroundBlendMode: 'overlay'
        }}
      />
      
      <div className="absolute inset-0 bg-brand-blue bg-opacity-70 z-10"></div>
      
      <div className="container mx-auto px-4 relative z-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 text-shadow animate-fade-up">
            Plateforme de Ressources Humaines <span className="text-brand-yellow">N°1</span> à IIT
          </h1>
          
          <p className="text-white text-lg md:text-xl mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Gérez vos employés, congés, recrutements et évaluations en toute simplicité depuis une seule plateforme RH centralisée.          </p>
          
          <div className="mb-16 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                number: stats.prestataires.toLocaleString(),
                text: 'Employés',
                description: 'Gestion des profils et informations des employés',
                delay: '0.3s'
              },
              {
                number: stats.clients.toLocaleString(),
                text: 'Congés',
                description: 'Suivi des demandes de congés et soldes',
                delay: '0.4s'
              },
              {
                number: stats.services.toLocaleString(),
                text: 'Recrutements',
                description: 'Suivi des offres d\'emploi et candidatures',
                delay: '0.5s'
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-xl bg-opacity-20 backdrop-blur-sm text-white border-0 animate-fade-up" 
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-2xl md:text-3xl font-bold mb-2 text-brand-yellow">{stat.number}</div>
                <div className="text-lg md:text-xl font-medium mb-2">{stat.text}</div>
                <p className="text-sm text-gray-200">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,48C1120,32,1280,32,1440,42.7L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
