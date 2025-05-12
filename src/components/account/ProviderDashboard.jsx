import { useEffect, useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import AddServiceForm from "./AddServiceForm";
import ServicesList from "./ServicesList";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState("services");
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    num_tel: "",
    ville: "",
    photo: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setEditedUser({
        name: parsed.name || "",
        num_tel: parsed.num_tel || "",
        ville: parsed.ville || "",
        photo: null,
      });
    }
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", editedUser.name);
      formData.append("num_tel", editedUser.num_tel);
      formData.append("ville", editedUser.ville);
      if (editedUser.photo) {
        formData.append("photo", editedUser.photo);
      }

      const response = await axios.post(
        `http://localhost:8000/api/users/${user.id}?_method=PUT`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedUser = response.data.user; // utilise response.data.user au lieu de data seul
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowEditModal(false);
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Échec de la mise à jour du profil.");
    }
  };

  const getPhotoUrl = () => {
    if (!user?.photo) return null;
    return `http://localhost:8000/storage/${user.photo}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-blue">Espace Prestataire</h1>
        {activeTab === "services" && !showAddServiceForm && (
          <Button
            onClick={() => setShowAddServiceForm(true)}
            className="bg-brand-yellow text-brand-blue hover:bg-yellow-500"
          >
            Ajouter un service
          </Button>
        )}
        {showAddServiceForm && (
          <Button
            onClick={() => setShowAddServiceForm(false)}
            variant="outline"
            className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            Retour à mes services
          </Button>
        )}
      </div>

      {showAddServiceForm ? (
        <AddServiceForm onCancel={() => setShowAddServiceForm(false)} />
      ) : (
        <Tabs defaultValue="services" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="services">Mes Services</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="profile">Mon Profil</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <ServicesList />
          </TabsContent>

          <TabsContent value="reservations">
            <div className="p-6 bg-gray-50 rounded-md text-center">
              <h3 className="text-lg font-medium text-gray-500">
                Aucune réservation pour le moment
              </h3>
              <p className="text-gray-400">
                Les réservations de vos clients apparaîtront ici
              </p>
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="p-6 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-4">Informations du profil</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{user?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{user?.num_tel || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ville</p>
                  <p className="font-medium">{user?.ville || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Photo</p>
                  {getPhotoUrl() ? (
                    <img
                      src={getPhotoUrl()}
                      alt="Photo de profil"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <p className="font-medium">Aucune photo</p>
                  )}
                </div>
              </div>

              {/* MODAL Modifier le profil */}
              <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
                <DialogTrigger asChild>
                  <Button
                    className="mt-6 bg-brand-blue text-white hover:bg-brand-darkBlue"
                    onClick={() => setShowEditModal(true)}
                  >
                    Modifier le profil
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Modifier mon profil</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nom</Label>
                      <Input
                        id="name"
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, name: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="num_tel" className="text-right">Téléphone</Label>
                      <Input
                        id="num_tel"
                        value={editedUser.num_tel}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, num_tel: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ville" className="text-right">Ville</Label>
                      <Input
                        id="ville"
                        value={editedUser.ville}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, ville: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="photo" className="text-right">Photo</Label>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, photo: e.target.files[0] })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleUpdateProfile}>Enregistrer</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ProviderDashboard;
