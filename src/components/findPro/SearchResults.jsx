
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchResults = ({ location, serviceProviders }) => {
  return (
    <div className="search-results mb-12">
      {/* Results header with breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-brand-blue">Accueil</Link>
        <span className="mx-2">›</span>
        <Link to="/trouver-un-pro" className="hover:text-brand-blue">Trouver Un Pro</Link>
        {location && (
          <>
            <span className="mx-2">›</span>
            <span className="text-brand-blue font-medium">{location}</span>
          </>
        )}
      </nav>
      
      {/* Hero banner */}
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden mb-10">
        <img 
          src="/lovable-uploads/87885eaf-318a-42a8-ab2c-78a967185e04.png" 
          alt="Service professionals" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-transparent opacity-60"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="ml-10 text-white">
            <div className="flex items-center mb-3">
              <img src="/lovable-uploads/878f464c-c6cf-4466-bf8c-8c937be3fd14.png" alt="ijeni logo" className="w-20 h-20" />
              <h2 className="text-3xl font-bold ml-3">ijeni</h2>
            </div>
          </div>
        </div>
      </div>
      
      {/* Service quality badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <QualityBadge 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 12 2 2 4-4"></path>
              <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"></path>
            </svg>
          } 
          label="Prestataires vérifiés" 
        />
        <QualityBadge 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          } 
          label="Service client 24/7" 
        />
        <QualityBadge 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          } 
          label="Interventions assurés" 
        />
        <QualityBadge 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5z"></path>
              <path d="m3 3 18 18"></path>
              <path d="M10.5 13.5 7 17"></path>
              <path d="m7 12 5 5 4-4"></path>
            </svg>
          } 
          label="Profitez gratuitement" 
        />
      </div>

      {/* Service providers listing */}
      <h2 className="text-2xl font-bold text-brand-blue mb-8">
        Notre selection des Prestataires les plus proche de chez vous
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {serviceProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  );
};

const QualityBadge = ({ icon, label }) => {
  return (
    <div className="flex items-center">
      <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white mr-3">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
  );
};

const ProviderCard = ({ provider }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start p-4">
        <div className="w-16 h-16 rounded-md overflow-hidden mr-3 flex-shrink-0">
          <img src={provider.imageUrl} alt={provider.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg text-brand-blue">{provider.name}</h3>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-brand-blue" />
              <span className="text-sm font-medium text-brand-blue">{provider.distance}</span>
            </div>
          </div>
          <p className="text-right text-gray-600 font-arabic mb-2">{provider.arabicName}</p>
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(provider.rating) ? "text-brand-yellow fill-brand-yellow" : "text-gray-300"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">{provider.reviews} Revues</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
