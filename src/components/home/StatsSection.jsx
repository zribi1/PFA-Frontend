import React, { useEffect, useState } from 'react';
import { Users, Award, CheckCircle } from 'lucide-react';
import axios from 'axios';

const StatsSection = () => {
  const [stats, setStats] = useState({
    prestataires: 0,
    clients: 0,
    services: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
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

    fetchStats();
  }, []);

  const dynamicStats = [
    {
      icon: Users,
      value: stats.prestataires.toLocaleString(),
      label: 'Prestataires',
      description: 'Prestataires de service partout en Tunisie',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: CheckCircle,
      value: stats.clients.toLocaleString(),
      label: 'Clients',
      description: 'Clients satisfaits partout en Tunisie',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Award,
      value: stats.services.toLocaleString(),
      label: 'Services livrés',
      description: 'Services livrés en toute simplicité',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    }
  ];

  return (
    <section className="py-20 bg-brand-blue">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-up">
            Nos <span className="text-brand-yellow">Chiffres</span> Parlent
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Faites confiance à la plateforme leader de services à domicile en Tunisie
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dynamicStats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-card bg-white border-0 p-8 rounded-xl text-center animate-fade-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`${stat.bgColor} ${stat.color} w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <h3 className="text-4xl font-bold text-brand-blue mb-2">{stat.value}</h3>
              <p className="text-xl font-semibold text-brand-blue mb-3">{stat.label}</p>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
