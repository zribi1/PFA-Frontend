
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const ServiceCard = ({ 
  service,
  variant = 'service', // 'service', 'promotion', 'provider'
  className
}) => {
  // Default placeholder image if none provided
  const imageUrl = service.imageUrl || 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80';
  
  // Function to render ratings as stars
  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "w-4 h-4", 
              i < Math.floor(rating) ? "text-brand-yellow fill-brand-yellow" : "text-gray-300"
            )} 
          />
        ))}
      </div>
    );
  };

  return (
    <Link to={`/service/${service.id}`} className={cn(
      "service-card-new transition-all group block",
      variant === 'promotion' && 'relative',
      className
    )}>
      {/* Promotion Badge */}
      {variant === 'promotion' && service.discount && (
        <div className="absolute top-3 right-3 bg-brand-yellow text-brand-blue font-bold py-1 px-3 rounded-full text-sm z-10">
          {service.discount}% OFF
        </div>
      )}
      
      {/* Image Container */}
      <div className="aspect-[4/3] w-full relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {/* Provider details overlay for 'provider' variant */}
        {variant === 'provider' && (
          <div className="absolute inset-0 bg-gradient-to-t from-brand-blue to-transparent opacity-70"></div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Title and Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-brand-blue line-clamp-1">
            {service.title}
          </h3>
          
          {service.rating && (
            <div className="flex items-center">
              {renderRating(service.rating)}
            </div>
          )}
        </div>
        
        {/* Subtitle or Provider Info */}
        {service.subtitle && (
          <p className="text-gray-600 text-sm mb-2">{service.subtitle}</p>
        )}
        
        {/* Location */}
        {service.location && (
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{service.location}</span>
          </div>
        )}
        
        {/* Price and CTA */}
        <div className="flex justify-between items-center mt-4">
          {service.price && (
            <div className="flex items-baseline">
              {service.originalPrice && (
                <span className="text-gray-400 line-through text-sm mr-2">{service.originalPrice}DT</span>
              )}
              <span className="text-brand-blue font-bold text-xl">{service.price}DT</span>
            </div>
          )}
          
          <button className="btn-secondary text-sm px-4 py-2" onClick={(e) => e.preventDefault()}>
            {variant === 'provider' ? 'Contacter' : 'Réserver'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
