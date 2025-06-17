import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function Absence() {
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const [absences, setAbsences] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [emploiCours, setEmploiCours] = useState([]);
  const [seancesDispo, setSeancesDispo] = useState([]);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [jourSemaine, setJourSemaine] = useState('');
  const [selectedEnseignant, setSelectedEnseignant] = useState(null);

  const [form, setForm] = useState({
    enseignant_id: '',
    jour: '',            // date ISO (YYYY-MM-DD)
    seances: [],         // FOR VACATAIRE: name(s) of the séance only
    debut_heure: '',     // FOR BOTH: "HH:MM"
    fin_heure: '',       // FOR BOTH: "HH:MM"
    is_justified: false,
    justification_proof: null // File object
  });

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (form.enseignant_id && form.jour) {
      const jourNom = new Date(form.jour)
        .toLocaleDateString('fr-FR', { weekday: 'long' })
        .toLowerCase();
      setJourSemaine(jourNom);

      const filtered = emploiCours.filter((c) => {
        const coursEnsId = c.enseignant ?? null;
        const matchEns = String(coursEnsId) === String(form.enseignant_id);

        let jourCours = '';
        const parsedDate = new Date(c.jour);
        if (!isNaN(parsedDate.getTime())) {
          jourCours = parsedDate
            .toLocaleDateString('fr-FR', { weekday: 'long' })
            .toLowerCase();
        } else {
          jourCours = c.jour?.toLowerCase() || '';
        }
        const matchJour = jourCours === jourNom;
        return matchEns && matchJour;
      });

      setSeancesDispo(filtered);
    } else {
      setSeancesDispo([]);
      setJourSemaine('');
    }
  }, [form.enseignant_id, form.jour, emploiCours]);

  const fetchAll = async () => {
    try {
      const [resAbs, resEns, resCours] = await Promise.all([
        axios.get(`${api}/absencesens`),
        axios.get(`${api}/enseignant`),
        axios.get(`${api}/emploicour`)
      ]);
      setAbsences(resAbs.data);
      setEnseignants(resEns.data);
      setEmploiCours(resCours.data);
    } catch (err) {
      console.error('Erreur chargement données :', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let updated;
    if (type === 'checkbox') {
      updated = { ...form, [name]: checked };
    } else if (type === 'file') {
      updated = { ...form, [name]: files[0] || null };
    } else {
      updated = { ...form, [name]: value };
    }

    if (name === 'enseignant_id') {
      const ens = enseignants.find((u) => String(u.id) === String(value)) || null;
      setSelectedEnseignant(ens);
      updated = {
        ...updated,
        seances: [],
        debut_heure: '',
        fin_heure: '',
        justification_proof: null
      };
    }

    setForm(updated);
  };

  const toggleSeance = (matiere) => {
    setForm((prev) => {
      const exists = prev.seances.includes(matiere);
      const updatedList = exists
        ? prev.seances.filter((m) => m !== matiere)
        : [...prev.seances, matiere];
      return { ...prev, seances: updatedList };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construire FormData pour multipart/form-data
    const formData = new FormData();
    formData.append('enseignant_id', form.enseignant_id);
    formData.append('is_justified', form.is_justified ? '1' : '0');
    if (form.justification_proof) {
      formData.append('justification_proof', form.justification_proof);
    }
    formData.append('jour', form.jour);

    const situation = (selectedEnseignant?.situation_actuelle || '')
      .trim()
      .toLowerCase();

    if (situation === 'vacataire') {
      formData.append('type_absence', 'seances');

      if (form.seances.length > 0) {
        const firstMatiere = form.seances[0];
        formData.append('seances', firstMatiere);

        const matchSession = seancesDispo.find((s) => s.matiere === firstMatiere);
        if (matchSession) {
          const [startTime, endTime] = matchSession.horaire.split(' - ');
          formData.append('debut_heure', startTime);
          formData.append('fin_heure', endTime);
        }
      }
    } else {
      formData.append('type_absence', 'heures');
      formData.append('debut_heure', form.debut_heure);
      formData.append('fin_heure', form.fin_heure);
    }

    try {
      const response = await axios.post(`${api}/absencesens`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Réponse handleSubmit :', response.status, response.data);

      fetchAll();
      setShowModal(false);
      setForm({
        enseignant_id: '',
        jour: '',
        seances: [],
        debut_heure: '',
        fin_heure: '',
        is_justified: false,
        justification_proof: null
      });
      setSelectedEnseignant(null);
      setJourSemaine('');
      setSeancesDispo([]);
    } catch (err) {
      if (err.response) {
        console.error('handleSubmit erreur statut :', err.response.status);
        console.error('handleSubmit erreur données :', err.response.data);
      } else {
        console.error('handleSubmit erreur inattendue :', err);
      }
    }
  };

  const filtered = absences.filter(
    (a) =>
      a.enseignant?.nom.toLowerCase().includes(search.toLowerCase()) ||
      a.enseignant?.prenom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-[72px] p-6">
        <h2 className="text-2xl font-bold text-brand-blue mb-6">
           Absences des enseignants
        </h2>

        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-brand-blue text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Ajouter une absence
          </button>
          <input
            type="text"
            placeholder="Rechercher par nom ou prénom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-sm">
            <thead className="bg-brand-blue text-white">
              <tr>
                <th className="p-3 text-left">Enseignant</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Détails</th>
                <th className="p-3 text-left">Justifiée</th>
                <th className="p-3 text-left">Justificatif</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((a) => (
                  <tr key={a.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      {a.enseignant?.nom} {a.enseignant?.prenom}
                    </td>
                    <td className="p-3">{a.type_absence}</td>
                    <td className="p-3">
                      {a.type_absence === 'seances'
                        ? `Date : ${a.jour}, Séance : ${a.seances}, Horaire : ${a.debut_heure} - ${a.fin_heure}`
                        : `Date : ${a.jour}, Horaire : ${a.debut_heure} - ${a.fin_heure}`}
                    </td>
                    <td className="p-3">{a.is_justified ? '✅' : '❌'}</td>
                    <td className="p-3">{a.justification_proof ? <a href={a.justification_proof} target="_blank" rel="noopener noreferrer">Télécharger</a> : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Aucune absence enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-lg"
              >
                ✕
              </button>

              <h3 className="text-xl font-semibold mb-4 text-brand-blue">
                Nouvelle absence
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    name="enseignant_id"
                    value={form.enseignant_id}
                    onChange={handleChange}
                    required
                    className="border p-2 rounded"
                  >
                    <option value="">-- Sélectionner enseignant --</option>
                    {enseignants.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nom} {e.prenom}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    name="jour"
                    value={form.jour}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                  />
                  {jourSemaine && (
                    <p className="text-sm text-gray-600 col-span-2">
                      📅 {jourSemaine.charAt(0).toUpperCase() + jourSemaine.slice(1)}
                    </p>
                  )}

                  {selectedEnseignant?.situation_actuelle?.trim().toLowerCase() === 'vacataire' ? (
                    <div className="col-span-2">
                      <p className="text-sm font-medium mb-2">Séances disponibles :</p>
                      {seancesDispo.length > 0 ? (
                        seancesDispo.map((s) => (
                          <label key={s.id_jour} className="block">
                            <input
                              type="checkbox"
                              value={s.matiere}
                              checked={form.seances.includes(s.matiere)}
                              onChange={() => toggleSeance(s.matiere)}
                            />{' '}
                            {s.matiere} — <span className="italic text-sm">({s.horaire})</span>
                          </label>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">Aucune séance disponible ce jour.</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <input
                        type="time"
                        name="debut_heure"
                        value={form.debut_heure}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                      />
                      <input
                        type="time"
                        name="fin_heure"
                        value={form.fin_heure}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                      />
                      {form.debut_heure && form.fin_heure && (
                        <p className="text-sm text-gray-600 col-span-2">
                          Durée d'absence :{' '}
                          {(
                            new Date(`1970-01-01T${form.fin_heure}`) -
                            new Date(`1970-01-01T${form.debut_heure}`)
                          ) / 3600000}{' '}
                          heures
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="is_justified"
                      checked={form.is_justified}
                      onChange={handleChange}
                    />
                    <span>Justifiée</span>
                  </label>
                  <input
                    type="file"
                    name="justification_proof"
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    accept="application/pdf,image/*"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Enregistrer
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
