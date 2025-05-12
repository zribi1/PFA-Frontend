import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

const CongesList = () => {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConges = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/conges");
      setConges(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des congés:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id, statut) => {
    try {
      await axios.put(`http://localhost:8000/api/conges/${id}`, { statut });
      setConges(prev =>
        prev.map(c => (c.id === id ? { ...c, statut } : c))
      );
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
      alert("Échec de la mise à jour.");
    }
  };

  useEffect(() => {
    fetchConges();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Chargement des congés...</div>;
  }

  return (
    <div className="space-y-4">
      {conges.map((conge) => (
        <div
          key={conge.id}
          className="bg-white border rounded-lg shadow p-4 space-y-2"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">
                {conge.enseignant?.nom} {conge.enseignant?.prenom}
              </h3>
              <p className="text-gray-500 text-sm">Motif : {conge.motif}</p>
              <div className="text-sm text-gray-600">
                <Clock className="inline w-4 h-4 mr-1" />
                {conge.date_debut} → {conge.date_fin}
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {conge.statut}
            </Badge>
          </div>

          {conge.statut === "en_attente" && (
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50"
                onClick={() => updateStatut(conge.id, "accepte")}
              >
                <CheckCircle className="w-4 h-4 mr-1" /> Accepter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
                onClick={() => updateStatut(conge.id, "refuse")}
              >
                <XCircle className="w-4 h-4 mr-1" /> Refuser
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CongesList;
