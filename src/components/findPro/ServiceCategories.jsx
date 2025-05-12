
import React from 'react';
import { Wrench, Car, Laptop, Ship, Zap, PaintBucket, Home, Volume2, Leaf, ArrowUpRight, Sparkles, BookOpen, Languages } from 'lucide-react';

const ServiceCategories = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {/* Entretien et réparation */}
      <CategoryCard 
        title="Entretien et réparation"
        icon={<Wrench className="w-6 h-6" />}
        items={[
          { icon: <Wrench className="w-4 h-4" />, label: "Plomberie" },
          { icon: <Leaf className="w-4 h-4" />, label: "Abattage et élagage d'arbre" },
          { icon: <Home className="w-4 h-4" />, label: "Abris" },
          { icon: <ArrowUpRight className="w-4 h-4" />, label: "Ascenseurs" },
          { icon: <Sparkles className="w-4 h-4" />, label: "Bricolage et montage" },
          { icon: <Zap className="w-4 h-4" />, label: "Électricité" }
        ]}
      />
      
      {/* Chauffeurs */}
      <CategoryCard 
        title="Chauffeurs"
        icon={<Car className="w-6 h-6" />}
        items={[
          { icon: <Car className="w-4 h-4" />, label: "Voiture tourisme avec chauffeur" }
        ]}
      />
      
      {/* Multimédia et IT */}
      <CategoryCard 
        title="Multimédia et IT"
        icon={<Laptop className="w-6 h-6" />}
        items={[
          { icon: <Volume2 className="w-4 h-4" />, label: "Audio" },
          { icon: <PaintBucket className="w-4 h-4" />, label: "Design graphique" },
          { icon: <Laptop className="w-4 h-4" />, label: "IT" }
        ]}
      />
      
      {/* Services bateaux */}
      <CategoryCard 
        title="Services bateaux"
        icon={<Ship className="w-6 h-6" />}
        items={[
          { icon: <Zap className="w-4 h-4" />, label: "Électricité et électronique" },
          { icon: <Car className="w-4 h-4" />, label: "Mécanique bateaux" },
          { icon: <Sparkles className="w-4 h-4" />, label: "Nettoyage bateau" }
        ]}
      />
      
      {/* Coaching et formation */}
      <CategoryCard 
        title="Coaching et formation"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
          </svg>
        }
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        items={[
          { icon: <BookOpen className="w-4 h-4" />, label: "Art martial" },
          { icon: <BookOpen className="w-4 h-4" />, label: "Coach sportif" },
          { icon: <BookOpen className="w-4 h-4" />, label: "Cours de cuisine" }
        ]}
      />
      
      {/* Rédaction et traduction */}
      <CategoryCard 
        title="Rédaction et traduction"
        icon={<Languages className="w-6 h-6" />}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        items={[
          { icon: <Languages className="w-4 h-4" />, label: "Allemand" },
          { icon: <Languages className="w-4 h-4" />, label: "Anglais" },
          { icon: <Languages className="w-4 h-4" />, label: "Chinois" }
        ]}
      />
    </div>
  );
};

const CategoryCard = ({ title, icon, items, iconBgColor = "bg-gray-100", iconColor = "text-brand-blue" }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center">
          <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center ${iconColor}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-lg ml-3 text-brand-blue">{title}</h3>
        </div>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-1 gap-1">
          {items.map((item, index) => (
            <CategoryItem key={index} icon={item.icon} label={item.label} />
          ))}
        </div>
      </div>
    </div>
  );
};

const CategoryItem = ({ icon, label }) => {
  return (
    <div className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
      <span className="text-brand-blue mr-2">{icon}</span>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
};

export default ServiceCategories;
