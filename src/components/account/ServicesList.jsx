import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Edit, Trash, Eye } from "lucide-react";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const deleteService = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        // Effectuer la requête DELETE pour supprimer le service du backend
        await axios.delete(`http://localhost:8000/api/services/${id}`);

        // Si la suppression réussit, supprimer le service localement
        setServices(prev => prev.filter(service => service.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression du service:", error);
        alert("Une erreur est survenue lors de la suppression du service.");
      }
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesRes = await axios.get("http://localhost:8000/api/services");
        const allServices = servicesRes.data;

        if (!user || !user.id) {
          console.warn("Aucun utilisateur trouvé dans le localStorage.");
          return;
        }

        const filtered = allServices.filter(service => service.prestataire_id === user.id);

        // Charger les notes pour chaque service
        const servicesWithNotes = await Promise.all(
          filtered.map(async (service) => {
            try {
              const avisRes = await axios.get(`http://localhost:8000/api/services/${service.id}/avis`);
              return { ...service, note_moyenne: avisRes.data.note_moyenne };
            } catch (err) {
              console.warn("Erreur lors de la récupération de la note pour le service", service.id);
              return { ...service, note_moyenne: 0 };
            }
          })
        );

        setServices(servicesWithNotes);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);



  const getPhotoUrl = (photo) => {
    if (!photo) return "https://via.placeholder.com/150";
    const corrected = photo.replace(/(.*\/[^.]+)(png|jpg|jpeg|webp)$/i, '$1.$2');
    return `http://localhost:8000/storage/${corrected}`;
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const isValidDate = (date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()); // Vérifie si la date est valide
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation des données avant envoi
    const updatedService = {
      titre: currentService.titre,
      description: currentService.description,
      prix_base: parseFloat(currentService.prix_base),
      ville: currentService.ville,
      prix_promotionnel: currentService.prix_promotionnel ? parseFloat(currentService.prix_promotionnel) : null,
      photo: currentService.photo || null,
      promotion_expire_at: currentService.promotion_expire_at || null,
    };

    // Validation de la date promotion_expire_at si nécessaire
    if (updatedService.promotion_expire_at && !isValidDate(updatedService.promotion_expire_at)) {
      alert("La date de fin de promotion est invalide.");
      return;
    }

    const formData = new FormData();
    formData.append('titre', currentService.titre);
    formData.append('description', currentService.description);
    formData.append('prix_base', currentService.prix_base);
    formData.append('ville', currentService.ville);
    formData.append('prix_promotionnel', currentService.prix_promotionnel);

    // Ajouter la photo si elle existe
    if (currentService.photo instanceof File) {
      formData.append('photo', currentService.photo);
    }

    // Si la promotion expire à une date, l'ajouter à FormData
    if (currentService.promotion_expire_at && isValidDate(currentService.promotion_expire_at)) {
      formData.append('promotion_expire_at', currentService.promotion_expire_at);
    }

    try {
      console.log("Données envoyées pour la mise à jour:", updatedService);

      // Effectue la requête PUT pour mettre à jour le service
      await axios.put(`http://localhost:8000/api/services/${currentService.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Mets à jour les services localement
      setServices(prev => prev.map(service => service.id === currentService.id ? { ...service, ...updatedService } : service));
      setIsModalOpen(false); // Ferme le modal après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du service:", error.response ? error.response.data : error.message);
      alert("Une erreur est survenue lors de la mise à jour du service. Veuillez vérifier les champs et réessayer.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div>
      {services.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-500">Aucun service trouvé</h3>
          <p className="text-gray-400 mb-4">Ajoutez votre premier service</p>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map(service => (
            <div key={service.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40">
                  <img
                    src={getPhotoUrl(service.photo)}
                    alt={service.titre}
                    className="w-full h-full object-cover rounded-l-md"
                  />
                </div>
                <div className="p-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{service.titre}</h3>
                      <p className="text-sm text-gray-500">{service.scategorie?.nom || "Sans sous-catégorie"}</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      ⭐{" "}
                      {service.note_moyenne > 0 ? service.note_moyenne.toFixed(1) : "Aucune note"}
                    </Badge>
                  </div>

                  <div className="mt-3 flex gap-3 flex-wrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.ville}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.prix_promotion} DTN/heure
                      {service.prix_base && (
                        <span className="ml-2 text-sm text-red-500 line-through">{service.prix_base} DTN/heure</span>
                      )}
                    </div>

                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      <Eye className="h-4 w-4 mr-1" /> Voir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-600 border-amber-600 hover:bg-amber-50"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && currentService && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Modifier le service</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Titre</label>
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={currentService.titre}
                  onChange={(e) => setCurrentService({ ...currentService, titre: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={currentService.description}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Prix</label>
                <input
                  type="number"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={currentService.prix_base}
                  onChange={(e) => setCurrentService({ ...currentService, prix_base: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Prix de la promotion</label>
                <input
                  type="number"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={currentService.prix_promotionnel}
                  onChange={(e) => setCurrentService({ ...currentService, prix_promotionnel: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={currentService.ville}
                  onChange={(e) => setCurrentService({ ...currentService, ville: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Promotion Expire At</label>
                <input
                  type="date"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={currentService.promotion_expire_at}
                  onChange={(e) => setCurrentService({ ...currentService, promotion_expire_at: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" size="sm">Enregistrer</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList;
