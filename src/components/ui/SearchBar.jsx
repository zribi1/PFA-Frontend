import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

const SearchBar = ({ variant = 'default', className }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8000/api/categories');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Catégorie sélectionnée:', selectedCategory);
    // Implémentez votre logique de recherche ici
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn(
        "flex flex-col md:flex-row gap-3 w-full max-w-3xl mx-auto",
        variant === 'minimal' && 'max-w-xl',
        className
      )}
    >
      <div className="relative flex-grow">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className={cn(
            "h-5 w-5",
            variant === 'minimal' ? 'text-gray-400' : 'text-brand-yellow'
          )} />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={cn(
            "w-full pl-10 py-3 rounded-xl outline-none focus:ring-2 transition-all appearance-none",
            variant === 'minimal' 
              ? 'border border-gray-300 focus:ring-brand-blue focus:border-brand-blue text-sm' 
              : 'shadow-lg focus:ring-brand-yellow text-base'
          )}
          disabled={isLoading}
        >
          <option value="">Sélectionnez une catégorie...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.nom}
            </option>
          ))}
        </select>
      </div>
      
      {variant !== 'minimal' && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-brand-yellow" />
          </div>
          <select
            className="pl-10 py-3 pr-4 rounded-xl border-none shadow-lg appearance-none bg-white focus:ring-2 focus:ring-brand-yellow outline-none transition-all w-full md:w-auto"
          >
            <option value="">Toute la Tunisie</option>
            <option value="tunis">Tunis</option>
            <option value="ariana">Ariana</option>
            <option value="ben-arous">Ben Arous</option>
            <option value="sousse">Sousse</option>
            <option value="sfax">Sfax</option>
          </select>
        </div>
      )}
      
      <button
        type="submit"
        className={cn(
          "rounded-xl font-semibold transition-all",
          variant === 'minimal' 
            ? 'bg-brand-blue text-white px-4 py-2 text-sm hover:bg-brand-darkBlue' 
            : 'bg-brand-yellow text-brand-blue px-8 py-3 text-base hover:bg-yellow-400',
          isLoading && 'opacity-70 cursor-not-allowed'
        )}
        disabled={isLoading}
      >
        {isLoading ? 'Chargement...' : variant === 'minimal' ? 'Chercher' : 'Rechercher'}
      </button>
    </form>
  );
};

export default SearchBar;