import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import EmployeeFormModal from '@/components/employees/EmployeeFormModal'
import Organigramme from '@/components/employees/Organigramme'
import EmployeeManagement from '@/components/employees/EmployeeManagement'
import {
  ArrowLeft,
  User,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const departments = ['IT', 'RH', 'Marketing', 'Finance', 'Production']
const contractTypes = ['CDI', 'CDD', 'Stage', 'Freelance']
const locations = ['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte']
const genres = ['Homme', 'Femme', 'Autre']
const etatsCivils = ['Célibataire', 'Marié', 'Divorcé', 'Veuf']
const typesId = ['CIN', 'Passeport', 'Permis']

// Map codes to readable values
const mapGenre = g => ({ 'H': 'Homme', 'F': 'Femme', 'A': 'Autre' }[g] || g)
const mapEtatCivil = e => ({ 'C': 'Célibataire', 'M': 'Marié', 'D': 'Divorcé', 'V': 'Veuf' }[e] || e)
// Reverse mapping for form submission
const reverseGenre = g => ({ 'Homme': 'H', 'Femme': 'F', 'Autre': 'A' }[g] || g)
const reverseEtatCivil = e => ({ 'Célibataire': 'C', 'Marié': 'M', 'Divorcé': 'D', 'Veuf': 'V' }[e] || e)

// Initial empty state for employees
const initialEmployees = []

export default function GestionEmployes() {
  const [activeTab, setActiveTab] = useState('organigramme')
  const [employees, setEmployees] = useState(initialEmployees)
  const [filtered, setFiltered] = useState(initialEmployees)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ department: '', contract: '', location: '' })
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [detailUser, setDetailUser] = useState(null)

  const [form, setForm] = useState({
    id: null,
    nom: '',
    prenom: '',
    genre: '',
    etat_civil: '',
    date_naissance: '',
    lieu_naissance: '',
    nationalite: '',
    rue: '',
    numero: '',
    ville: '',
    code_postal: '',
    pays: '',
    type_identite: '',
    numero_identite: '',
    date_delivrance: '',
    email: '',
    tel_gsm: '',
    tel_fixe: '',
    diplome: '',
    domaine: '',
    grade: '',
    experience_academique: '',
    experience_professionnelle: '',
    autre_diplome: '',
    cv: '',
    situation_actuelle: '',
    nombre_heure: '',
    etablissement_origine: '',
    date_autorisation: '',
    date_recrutement: '',
    numero_affiliation: '',
    categorie: '',
    rib: '',
    login: '',
    pswd: '',
    etablissement: '',
    role: 'Employee',
    salaire_fixe: '',
    salaire_restant: '',
    date_modification: ''
  })

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  // 1️⃣ Chargement initial
  useEffect(() => {
    setLoading(true);

    axios.get(`${API}/enseignant`)
      .then(({ data }) => {
        const mappedData = data.map(u => ({
          ...u,
          name: `${u.prenom} ${u.nom}`,
          position: u.grade,
          department: u.domaine,
          contract: u.categorie,
          location: u.ville,
          skills: u.experience_professionnelle?.split(',') || [],
          email: u.email,
          phone: u.tel_gsm,
          startDate: u.date_recrutement?.slice(0, 10) || '',
          genre: mapGenre(u.genre),
          etat_civil: mapEtatCivil(u.etat_civil),
          date_naissance: u.date_naissance?.slice(0, 10) || '',
          lieu_naissance: u.lieu_naissance,
          nationalite: u.nationalite,
          rue: u.rue,
          numero: u.numero,
          code_postal: u.code_postal,
          pays: u.pays,
          adresse: `${u.rue || ''}, ${u.numero || ''}, ${u.ville || ''} ${u.code_postal || ''}`,
          type_identite: u.type_identite,
          numero_identite: u.numero_identite,
          date_delivrance: u.date_delivrance?.slice(0, 10) || '',
          tel_fixe: u.tel_fixe,
          diplome: u.diplome,
          autre_diplome: u.autre_diplome,
          situation_actuelle: u.situation_actuelle,
          nombre_heure: u.nombre_heure,
          etablissement_origine: u.etablissement_origine,
          date_autorisation: u.date_autorisation?.slice(0, 10) || '',
          date_recrutement: u.date_recrutement?.slice(0, 10) || '',
          numero_affiliation: u.numero_affiliation,
          rib: u.rib,
          salaire_fixe: u.salaire_fixe,
          salaire_restant: u.salaire_restant,
          login: u.login,
          etablissement: u.etablissement,
          cv: u.cv
        }));

        setEmployees(mappedData);
        setFiltered(mappedData);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des employés:", error);
        setEmployees(initialEmployees);
        setFiltered(initialEmployees);
      })
      .finally(() => setLoading(false));
  }, [API]);


  // 2️⃣ Recherche + filtres
  useEffect(() => {
    let tmp = [...employees]
    if (search) {
      const s = search.toLowerCase()
      tmp = tmp.filter(e =>
        (e.name?.toLowerCase().includes(s) || false) ||
        (e.position?.toLowerCase().includes(s) || false)
      )
    }
    if (filters.department) tmp = tmp.filter(e => e.department === filters.department)
    if (filters.contract) tmp = tmp.filter(e => e.contract === filters.contract)
    if (filters.location) tmp = tmp.filter(e => e.location === filters.location)
    setFiltered(tmp)
  }, [search, filters, employees])

  // 3️⃣ Utilitaires
  const clearFilters = () => {
    setFilters({ department: '', contract: '', location: '' })
    setSearch('')
  }
  const resetForm = () => setForm({
    id: null,
    nom: '',
    prenom: '',
    genre: '',
    etat_civil: '',
    date_naissance: '',
    lieu_naissance: '',
    nationalite: '',
    rue: '',
    numero: '',
    ville: '',
    code_postal: '',
    pays: '',
    type_identite: '',
    numero_identite: '',
    date_delivrance: '',
    email: '',
    tel_gsm: '',
    tel_fixe: '',
    diplome: '',
    domaine: '',
    grade: '',
    experience_academique: '',
    experience_professionnelle: '',
    autre_diplome: '',
    cv: '',
    situation_actuelle: '',
    nombre_heure: '',
    etablissement_origine: '',
    date_autorisation: '',
    date_recrutement: '',
    numero_affiliation: '',
    categorie: '',
    rib: '',
    login: '',
    pswd: '',
    etablissement: '',
    role: 'Employee',
    salaire_fixe: '',
    salaire_restant: '',
    date_modification: ''
  })

  // 4️⃣ Préparer la modification
  const startEdit = emp => {
    setForm({
      ...emp,
      // Ensure we don't pass the File object from previous edits
      cv: emp.cv || ''
    })
    setShowForm(true)
  }

  // 5️⃣ Suppression
  const handleDelete = id => {
    if (!window.confirm('Confirmer la suppression ?')) return

    axios.delete(`${API}/enseignant/${id}`)
      .then(() => {
        setEmployees(es => es.filter(e => e.id !== id))
        setFiltered(es => es.filter(e => e.id !== id))
      })
      .catch(error => {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression de l'employé");
      });
  }

  // 6️⃣ Création / Mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set current date for date_modification
    const currentDate = new Date().toISOString().slice(0, 10);
    const formWithDefaults = {
      ...form,
      date_modification: currentDate,
      // Set default values for required fields if empty
      type_identite: form.type_identite || typesId[0],
      login: form.login || form.email || `${form.prenom.toLowerCase()}.${form.nom.toLowerCase()}`,
      pswd: form.pswd || Math.random().toString(36).slice(-10), // Password aléatoire de 10 caractères
      salaire_restant: form.salaire_restant || form.salaire_fixe || "0", // Copy from salaire_fixe or default to 0
      date_delivrance: form.date_delivrance || currentDate // Use current date if not provided
    };

    const formData = new FormData();

    // Append fields to formData
    for (const key in formWithDefaults) {
      const value = formWithDefaults[key];

      if (value !== null && value !== undefined) {
        if (key === 'cv') {
          // Only send if it's a File (new upload)
          if (value instanceof File) {
            formData.append('cv', value);
          }
          // If it's a string (old filename), skip it entirely
        } else {
          formData.append(key, value); // All other fields
        }
      }
    }

    // Convert visible labels back to backend codes
    if (formWithDefaults.genre) formData.set('genre', reverseGenre(formWithDefaults.genre));
    if (formWithDefaults.etat_civil) formData.set('etat_civil', reverseEtatCivil(formWithDefaults.etat_civil));

    try {
      let response;

      if (form.id) {
        formData.append('_method', 'PUT'); // Laravel method override
        response = await axios.post(`${API}/enseignant/${form.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      } else {
        response = await axios.post(`${API}/enseignant`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
      }

      const data = response.data;

      const updated = {
        ...data,
        name: `${data.prenom} ${data.nom}`,
        position: data.grade,
        department: data.domaine,
        contract: data.categorie,
        location: data.ville,
        skills: data.experience_professionnelle?.split(',') || [],
        email: data.email,
        phone: data.tel_gsm,
        startDate: data.date_recrutement?.slice(0, 10) || '',
        genre: mapGenre(data.genre),
        etat_civil: mapEtatCivil(data.etat_civil),
        date_naissance: data.date_naissance?.slice(0, 10) || '',
        date_delivrance: data.date_delivrance?.slice(0, 10) || '',
        date_autorisation: data.date_autorisation?.slice(0, 10) || '',
        date_recrutement: data.date_recrutement?.slice(0, 10) || '',
        date_modification: data.date_modification?.slice(0, 16).replace('T', ' ') || '',
        adresse: `${data.rue || ''}, ${data.numero || ''}, ${data.ville || ''} ${data.code_postal || ''}`,
      };

      if (form.id) {
        setEmployees(es => es.map(e => e.id === updated.id ? updated : e));
        setFiltered(es => es.map(e => e.id === updated.id ? updated : e));
      } else {
        setEmployees(es => [updated, ...es]);
        setFiltered(es => [updated, ...es]);
      }

      alert(form.id ? "Employé modifié avec succès" : "Employé ajouté avec succès");
      setShowForm(false);
      resetForm();

    } catch (err) {
      console.error("❌ Erreur lors de l'envoi du formulaire");

      // 🔍 Affiche l'objet FormData (clé/valeurs)
      for (let pair of formData.entries()) {
        console.log(`📦 ${pair[0]}:`, pair[1]);
      }

      // 🔍 Détails Axios
      if (err.response) {
        console.error("📡 Statut HTTP :", err.response.status);
        console.error("📄 Réponse Laravel :", err.response.data);
      } else if (err.request) {
        console.error("📭 Aucune réponse reçue :", err.request);
      } else {
        console.error("💥 Erreur JS :", err.message);
      }

      alert("Une erreur est survenue lors de l'enregistrement. Vérifiez la console pour plus de détails.");
    }
  };

  // 7️⃣ Voir détails
  const viewDetail = emp => {
    setDetailUser(emp)
    setShowDetail(true)
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Onglets */}
      <div className="pt-24 bg-gray-100">
        <div className="container mx-auto px-4 flex space-x-4">
          {['organigramme', 'employes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-t-lg",
                activeTab === tab
                  ? "bg-white text-brand-blue shadow"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              )}
            >
              {tab === 'organigramme' ? "Organigramme" : "Gestion des employés"}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'organigramme' ? (
          <Organigramme employees={employees} />
        ) : (
          <EmployeeManagement
            search={search}
            setSearch={setSearch}
            resetForm={resetForm}
            setShowForm={setShowForm}
            filters={filters}
            setFilters={setFilters}
            clearFilters={clearFilters}
            departments={departments}
            contractTypes={contractTypes}
            locations={locations}
            loading={loading}
            filtered={filtered}
            viewDetail={viewDetail}
            startEdit={startEdit}
            handleDelete={handleDelete}
          />
        )}

      </main>

      <Footer />

      {/* Modal Détail 👁️ */}
      {showDetail && detailUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Détails de {detailUser.name || 'l\'employé'}</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              {Object.entries(detailUser).filter(([key]) =>
                // Filter out some unwanted keys
                !['name', 'position', 'department', 'contract', 'location', 'skills', 'email', 'phone'].includes(key)
              ).map(([key, val]) => (
                <div key={key} className="flex">
                  <dt className="font-medium w-1/3">{key.replace(/_/g, ' ')}:</dt>
                  <dd className="flex-1">
                    {key === 'cv' && val ? (
                      <a
                        href={`${API}/storage/cv/${val}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Télécharger le CV
                      </a>
                    ) : Array.isArray(val) ? (
                      val.join(', ')
                    ) : (
                      String(val || '-')
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création / Modification */}
      <EmployeeFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm() }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        genres={genres}
        etatsCivils={etatsCivils}
        typesId={typesId}
        API={API}
      />

    </div>
  )
}
