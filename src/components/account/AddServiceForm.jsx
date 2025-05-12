import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

const AddServiceForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    titre: "",
    scategorie_id: "",
    description: "",
    prix_base: "",
    prix_promotion: "", // Nouveau champ prix_promotion
    ville: "",
    inclus: [],
    photo: null,
  });

  const [sousCategories, setSousCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Récupérer l'ID de l'utilisateur depuis le localStorage
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      toast({ title: "Erreur", description: "Identifiant utilisateur manquant" });
      return;
    }

    axios.get("http://localhost:8000/api/scategories")
      .then(res => setSousCategories(res.data))
      .catch(() => toast({ title: "Erreur", description: "Impossible de charger les sous-catégories" }));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "inclus") {
      const updated = checked
        ? [...formData.inclus, value]
        : formData.inclus.filter(item => item !== value);
      setFormData(prev => ({ ...prev, inclus: updated }));
    } else if (name === "photo") {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast({ title: "Erreur", description: "Identifiant utilisateur manquant" });
      return;
    }

    const data = new FormData();
    data.append("prestataire_id", userId);
    data.append("titre", formData.titre);
    data.append("scategorie_id", formData.scategorie_id);
    data.append("description", formData.description);
    data.append("prix_base", formData.prix_base);
    data.append("prix_promotion", formData.prix_promotion); // Ajout du prix_promotion
    data.append("ville", formData.ville);
    formData.inclus.forEach((item, i) => data.append(`inclus[${i}]`, item));
    if (formData.photo) data.append("photo", formData.photo);

    setUploading(true);
    try {
      await axios.post("http://localhost:8000/api/services", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast({ title: "Succès", description: "Service ajouté avec succès !" });
      onCancel();
    } catch (err) {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la soumission." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Ajouter un nouveau service</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="titre">Titre *</Label>
              <Input name="titre" id="titre" value={formData.titre} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="scategorie_id">Sous-catégorie *</Label>
              <select
                id="scategorie_id"
                name="scategorie_id"
                value={formData.scategorie_id}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Sélectionner une sous-catégorie</option>
                {sousCategories.map(sc => (
                  <option key={sc.id} value={sc.id}>{sc.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="prix_base">Prix de base *</Label>
              <Input name="prix_base" id="prix_base" type="number" min="0" value={formData.prix_base} onChange={handleChange} required />
            </div>

            <div>
              <Label htmlFor="prix_promotion">Prix promotionnel</Label>
              <Input name="prix_promotion" id="prix_promotion" type="number" min="0" value={formData.prix_promotion} onChange={handleChange} />
            </div>

            <div>
              <Label htmlFor="ville">Ville *</Label>
              <select
                name="ville"
                id="ville"
                value={formData.ville}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Sélectionner une ville</option>
                <option value="Tunis">Tunis</option>
                <option value="Sfax">Sfax</option>
                <option value="Sousse">Sousse</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={5} required />
            </div>

            <div>
              <Label htmlFor="inclus">Inclus</Label>
              <div className="flex flex-col space-y-2">
                {["Garantie", "Déplacement gratuit", "Support client"].map(option => (
                  <label key={option} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="inclus"
                      value={option}
                      checked={formData.inclus.includes(option)}
                      onChange={handleChange}
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="photo">Photo principale</Label>
              <Input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
          <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700" disabled={uploading}>
            {uploading ? "Envoi en cours..." : "Soumettre"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;
