import React, { useEffect, useState } from 'react';
import ServiceCard from '../ui/ServiceCard';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';

const PromotionsSection = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/services');
        const allServices = response.data;

        // Filtrer les services qui ont un prix_promotion non null ou différent de 0
        const promos = allServices.filter(service => service.prix_promotion && parseFloat(service.prix_promotion) > 0);

        // Mapper les données pour correspondre au format attendu par <ServiceCard />
        const formattedPromos = promos.map(service => ({
          id: service.id,
          title: service.titre,
          subtitle: service.scategorie?.nom || '',
          imageUrl: `http://localhost:8000/storage/${service.photo}`,
          rating: 4.5, // ou calculer à partir des avis si disponibles
          price: parseFloat(service.prix_promotion),
          originalPrice: parseFloat(service.prix_base),
          discount: Math.round(100 - (service.prix_promotion / service.prix_base) * 100),
          location: service.ville || service.prestataire?.ville || 'Non spécifiée'
        }));

        setPromotions(formattedPromos);
      } catch (error) {
        console.error('Erreur lors de la récupération des promotions :', error);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-brand-blue mb-4 animate-fade-up">
              Promotions
            </h2>
            <p className="text-gray-600 max-w-2xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
              Découvrez toutes nos offres promotionnelles pour économiser sur vos services préférés.
            </p>
          </div>
          <a 
            href="/promos" 
            className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue font-medium mt-4 md:mt-0 animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Voir plus 
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotions.map((promo, index) => (
            <div 
              key={promo.id} 
              className="animate-fade-up" 
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <ServiceCard service={promo} variant="promotion" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionsSection;
