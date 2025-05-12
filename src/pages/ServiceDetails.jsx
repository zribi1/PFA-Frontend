import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, MapPin } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [date, setDate] = useState(null);
  const [note, setNote] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/services/${id}`);
        if (!response.ok) throw new Error("Service non trouvé");
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error(error);
        setService(null);
      }
    };

    fetchService();
  }, [id]);

  const renderRating = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={cn(
              "w-5 h-5", 
              i < Math.floor(rating) ? "text-brand-yellow fill-brand-yellow" : "text-gray-300"
            )} 
          />
        ))}
        <span className="ml-2 text-gray-600">{rating} ({service?.reviewCount} avis)</span>
      </div>
    );
  };

  const handleReservation = () => {
    if (!date) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour votre réservation.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Réservation confirmée !",
      description: `Votre service a été réservé pour le ${format(date, 'PPP', { locale: fr })}.`,
    });
  };

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl p-10 text-center shadow-sm">
              <h3 className="text-xl font-medium text-brand-blue mb-2">Service non trouvé</h3>
              <p className="text-gray-500 mb-4">Le service que vous recherchez n'existe pas ou a été supprimé.</p>
              <Link to="/promos" className="btn-primary inline-block">
                Retour aux promotions
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Link to="/promos" className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue transition-all mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux promotions
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Service info */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-video w-full relative">
                  {service.discount && (
                    <div className="absolute top-4 right-4 bg-brand-yellow text-brand-blue font-bold py-1 px-3 rounded-full text-sm z-10">
                      {service.discount}% OFF
                    </div>
                  )}
                  <img 
                    src={service.imageUrl} 
                    alt={service.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-brand-blue mb-2">
                    {service.title}
                  </h1>
                  <p className="text-gray-600 mb-4">{service.subtitle}</p>
                  
                  <div className="flex items-center mb-4">
                    {renderRating(service.rating)}
                  </div>

                  <div className="flex items-center text-gray-600 mb-6">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{service.location}</span>
                  </div>
                  
                  <div className="flex items-baseline mb-8">
                    {service.originalPrice && (
                      <span className="text-gray-400 line-through text-lg mr-3">{service.originalPrice}DT</span>
                    )}
                    <span className="text-brand-blue font-bold text-3xl">{service.price}DT</span>
                  </div>
                  
                  <hr className="my-6 border-gray-200" />
                  
                  <h2 className="text-xl font-semibold text-brand-blue mb-4">Description</h2>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  
                  <h3 className="text-lg font-semibold text-brand-blue mb-3">Ce qui est inclus:</h3>
                  <ul className="list-disc pl-5 text-gray-600 mb-6 space-y-2">
                    {service.details && service.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column - Booking form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-brand-blue mb-5">Réserver ce service</h2>
                
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: fr }) : <span>Sélectionnez une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="mb-5">
                  <label className="block text-gray-700 mb-2">Note complémentaire</label>
                  <Textarea 
                    placeholder="Ajoutez des détails supplémentaires pour votre réservation..." 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="resize-none h-24"
                  />
                </div>
                
                <button 
                  className="w-full btn-secondary py-3 text-center font-medium"
                  onClick={handleReservation}
                >
                  Réserver maintenant
                </button>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  Réservation sans engagement, paiement sur place
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceDetails;
