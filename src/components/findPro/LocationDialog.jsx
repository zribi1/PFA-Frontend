
import React, { useState } from 'react';
import { X, MapPin, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// List of locations in Tunisia with Arabic names
const locations = [
  { id: 1, name: 'Ariana', arabicName: 'أريانة' },
  { id: 2, name: 'Manouba', arabicName: 'منوبة' },
  { id: 3, name: 'Ben Arous', arabicName: 'بن عروس' },
  { id: 4, name: 'Tunis', arabicName: 'تونس' },
  { id: 5, name: 'Ariana Medina', arabicName: 'أريانة مدينة' },
  { id: 6, name: 'Ettadhamen', arabicName: 'حي التضامن' },
  { id: 7, name: 'Kalaat el Andalous', arabicName: 'قلعة الأندلس' },
  { id: 8, name: 'Mnihla', arabicName: 'منيهلة' },
  { id: 9, name: 'Raoued', arabicName: 'رواد' },
  { id: 10, name: 'Sidi Thabet', arabicName: 'سيدي ثابت' },
  { id: 11, name: 'Soukra', arabicName: 'سكرة' },
  { id: 12, name: 'Amdoun', arabicName: 'عمدون' },
  { id: 13, name: 'Béja', arabicName: 'باجة' },
  { id: 14, name: 'Nefza', arabicName: 'نفزة' },
  { id: 15, name: 'Téboursouk', arabicName: 'تبرسق' },
];

const LocationDialog = ({ isOpen, onClose, onSelectLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredLocations = searchQuery 
    ? locations.filter(location => 
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        location.arabicName.includes(searchQuery)
      )
    : locations;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg overflow-hidden animate-fade-in">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-lg text-brand-blue">Veuillez sélectionner une adresse</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search input */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="w-5 h-5 text-yellow-500" />
            </div>
            <input
              type="text"
              placeholder="Quel adresse recherchez-vous ?"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Location list */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredLocations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Aucun résultat trouvé
            </div>
          ) : (
            filteredLocations.map((location) => (
              <button
                key={location.id}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                onClick={() => onSelectLocation(location.name)}
              >
                <div className="flex items-center">
                  <span className="text-gray-800">{location.name}</span>
                  <span className="text-gray-500 ml-2">({location.arabicName})</span>
                </div>
                <span className="text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationDialog;
