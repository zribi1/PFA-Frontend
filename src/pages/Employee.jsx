// src/pages/GestionEmployes.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import {
  ArrowLeft,
  User,
  Edit2,
  Trash2,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const initialEmployees = [
  { id: 1, name: 'Sarra Ben Amor', position: 'Développeuse Full-Stack', department: 'IT', contract: 'CDI', location: 'Tunis', skills: ['React','Laravel','Node.js'], email: 'sarra.benamor@example.com', phone: '+216 12 345 678', startDate: '2022-05-15' },
  { id: 2, name: 'Omar Trabelsi',           position: 'Manager RH',           department: 'RH', contract: 'CDI', location: 'Sfax', skills: ['RH','Recrutement','Formation'], email: 'omar.trabelsi@example.com', phone: '+216 98 765 432', startDate: '2020-11-03' }
]

const departments   = ['IT','RH','Marketing','Finance','Production']
const contractTypes = ['CDI','CDD','Stage','Freelance']
const locations     = ['Tunis','Sfax','Sousse','Nabeul','Bizerte']
const genres        = ['Homme','Femme','Autre']
const etatsCivils   = ['Célibataire','Marié','Divorcé','Veuf']
const typesId       = ['CIN','Passeport','Permis']
const roles         = ['Admin','Responsable RH','Employee']

export default function GestionEmployes() {
  const [activeTab,  setActiveTab]  = useState('organigramme')
  const [employees,  setEmployees]  = useState(initialEmployees)
  const [filtered,   setFiltered]   = useState(initialEmployees)
  const [loading,    setLoading]    = useState(false)
  const [search,     setSearch]     = useState('')
  const [filters,    setFilters]    = useState({ department:'', contract:'', location:'' })
  const [showForm,   setShowForm]   = useState(false)
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
    date_modification: '',
    etablissement: '',
    role: 'Employee',
    salaire_fixe: '',
    salaire_restant: ''
  })

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // 1️⃣ Chargement initial
  useEffect(() => {
    setLoading(true)
    axios.get(`${API}/api/users`)
      .then(({ data }) => {
        const ui = data.map(u => ({
          ...u,
          name:      `${u.prenom} ${u.nom}`,
          position:  u.grade,
          department:u.domaine,
          contract:  u.categorie,
          location:  u.ville,
          skills:    u.experience_professionnelle?.split(',') || [],
          email:     u.email,
          phone:     u.tel_gsm,
          startDate: u.date_recrutement?.slice(0,10) || ''
        }))
        setEmployees(ui)
        setFiltered(ui)
      })
      .catch(() => {
        setEmployees(initialEmployees)
        setFiltered(initialEmployees)
      })
      .finally(() => setLoading(false))
  }, [])

  // 2️⃣ Recherche + filtres
  useEffect(() => {
    let tmp = [...employees]
    if (search) {
      const s = search.toLowerCase()
      tmp = tmp.filter(e =>
        e.name.toLowerCase().includes(s) ||
        e.position.toLowerCase().includes(s)
      )
    }
    if (filters.department) tmp = tmp.filter(e=>e.department===filters.department)
    if (filters.contract)   tmp = tmp.filter(e=>e.contract  ===filters.contract)
    if (filters.location)   tmp = tmp.filter(e=>e.location  ===filters.location)
    setFiltered(tmp)
  }, [search, filters, employees])

  // 3️⃣ Utilitaires
  const clearFilters = () => {
    setFilters({ department:'', contract:'', location:'' })
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
    date_modification: '',
    etablissement: '',
    role: 'Employee',
    salaire_fixe: '',
    salaire_restant: ''
  })

  // 4️⃣ Préparer la modification
  const startEdit = emp => {
    setForm({ ...emp })
    setShowForm(true)
  }

  // 5️⃣ Suppression
  const handleDelete = id => {
    if (!window.confirm('Confirmer la suppression ?')) return
    axios.delete(`${API}/api/users/${id}`)
      .then(() => {
        setEmployees(es=>es.filter(e=>e.id!==id))
        setFiltered(es=>es.filter(e=>e.id!==id))
      })
  }

  // 6️⃣ Création / Mise à jour
  const handleSubmit = e => {
    e.preventDefault()
    const payload = { ...form }
    const req = form.id
      ? axios.put(`${API}/api/users/${form.id}`, payload)
      : axios.post(`${API}/api/users`, payload)

    req.then(({ data }) => {
      const updated = {
        ...data,
        name:      `${data.prenom} ${data.nom}`,
        position:  data.grade,
        department:data.domaine,
        contract:  data.categorie,
        location:  data.ville,
        skills:    data.experience_professionnelle?.split(',') || [],
        email:     data.email,
        phone:     data.tel_gsm,
        startDate: data.date_recrutement?.slice(0,10) || ''
      }
      if (form.id) {
        setEmployees(es => es.map(e=>e.id===updated.id ? updated : e))
        setFiltered(es => es.map(e=>e.id===updated.id ? updated : e))
      } else {
        setEmployees(es => [updated, ...es])
        setFiltered(es => [updated, ...es])
      }
    })
    .finally(() => {
      resetForm()
      setShowForm(false)
    })
  }

  // 7️⃣ Voir détails
  const viewDetail = emp => {
    setDetailUser(emp)
    setShowDetail(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar/>

      {/* Onglets */}
      <div className="pt-24 bg-gray-100">
        <div className="container mx-auto px-4 flex space-x-4">
          {['organigramme','employes'].map(tab => (
            <button
              key={tab}
              onClick={()=>setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-t-lg",
                activeTab===tab
                  ? "bg-white text-brand-blue shadow"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              )}
            >
              {tab==='organigramme' ? "Organigramme" : "Gestion des employés"}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab==='organigramme' ? (
          /* --- VUE ORGANIGRAMME (intact) --- */
          <div className="mb-12 bg-white rounded-xl shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Organigramme de l'entreprise</h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center">
                {/* Direction Générale */}
                <div className="relative mb-8">
                  <div className="w-64 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <div className="font-semibold text-blue-800">DIRECTEUR</div>
                    <div className="text-sm text-blue-600 mt-1">Dr. Issam Ksentini</div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-8 bg-gray-300"/>
                </div>
                {/* Responsables */}
                <div className="flex flex-wrap justify-center gap-8 mb-8">
                  {[
                    { title:"DIRECTEUR DES ÉTUDES TECHNOLOGIQUES", titleKey:"Dr. Ilhem Borcheni" },
                    { title:"DIRECTEUR DES ÉTUDES TIC",             titleKey:"Dr. Said Taktak"    },
                    { title:"DIRECTTEUR DES ÉTUDES ARCHITECTURE",   titleKey:"Dr. Hager Bejaoui"  }
                  ].map(({title,titleKey})=>(
                    <div key={titleKey} className="relative">
                      <div className="w-56 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                        <div className="font-semibold text-indigo-800">{title}</div>
                        <div className="text-xs text-indigo-600 mt-1">{titleKey}</div>
                      </div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-8 bg-gray-300"/>
                    </div>
                  ))}
                </div>
                {/* Extraits d'équipe */}
                <div className="flex flex-wrap justify-center gap-4">
                  {employees.slice(0,8).map(emp=>(
                    <div key={emp.id} className="w-48 p-2 bg-gray-50 border border-gray-200 rounded text-center">
                      <div className="font-medium text-gray-800">{emp.name.split(' ')[0]}</div>
                      <div className="text-xs text-gray-500">{emp.position}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* --- VUE GESTION DES EMPLOYÉS (dynamique) --- */
          <>
            {/* Barre recherche + ajouter */}
            <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <Link to="/" className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue">
                  <ArrowLeft className="w-4 h-4 mr-2"/> Retour
                </Link>
                <h1 className="mt-2 text-3xl font-bold text-brand-blue">Gestion des employés</h1>
              </div>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <input
                    type="text"
                    placeholder="Rechercher nom ou poste…"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    value={search}
                    onChange={e=>setSearch(e.target.value)}
                  />
                  <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"/>
                </div>
                <button
                  onClick={()=>{ resetForm(); setShowForm(true) }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  + Ajouter un employé
                </button>
              </div>
            </div>

            {/* Filtres et grille */}
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="w-full lg:w-64 shrink-0">
                <div className="bg-white rounded-xl p-5 shadow border border-gray-100 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">Filtres</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                    <select
                      value={filters.department}
                      onChange={e=>setFilters({...filters,department:e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Tous</option>
                      {departments.map(d=><option key={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contrat</label>
                    <select
                      value={filters.contract}
                      onChange={e=>setFilters({...filters,contract:e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Tous</option>
                      {contractTypes.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <select
                      value={filters.location}
                      onChange={e=>setFilters({...filters,location:e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Tous</option>
                      {locations.map(l=><option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800">
                    Réinitialiser les filtres
                  </button>
                </div>
              </aside>
              <section className="flex-grow">
                {loading ? (
                  <div className="bg-white rounded-xl p-10 text-center shadow">Chargement…</div>
                ) : filtered.length===0 ? (
                  <div className="bg-white rounded-xl p-10 text-center shadow">
                    <p className="text-gray-500">Aucun employé ne correspond aux critères.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(emp=>(                
                      <div key={emp.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
                        <div className="p-4 flex-grow">
                          <h3 className="font-semibold text-xl text-brand-blue">{emp.name}</h3>
                          <p className="text-gray-600 mt-1">{emp.position}</p>
                          <div className="mt-3 text-sm space-y-1">
        <div><span className="font-medium">Domaine:</span> {emp.department}</div>
        <div><span className="font-medium">Tél:</span>     {emp.phone}</div>
        <div><span className="font-medium">Ville:</span>   {emp.location}</div>
      </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex space-x-3">
                            <button
                              onClick={()=>viewDetail(emp)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Eye className="w-5 h-5"/>
                            </button>
                            <button
                              onClick={()=>startEdit(emp)}
                              className="flex items-center gap-1 text-blue-600 hover:underline"
                            >
                              <Edit2 className="w-5 h-5"/> Modifier
                            </button>
                          </div>
                          <button
                            onClick={()=>handleDelete(emp.id)}
                            className="flex items-center gap-1 text-red-600 hover:underline"
                          >
                            <Trash2 className="w-5 h-5"/> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      <Footer/>

      {/* Modal Détail 👁️ */}
      {showDetail && detailUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Détails de {detailUser.name}</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              {Object.entries(detailUser).map(([key, val]) => (
                <div key={key} className="flex">
                  <dt className="font-medium w-1/3">{key.replace(/_/g,' ')}:</dt>
                  <dd className="flex-1">{String(val)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 text-right">
              <button
                onClick={()=>setShowDetail(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Création / Modification */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">{form.id ? 'Modifier un employé' : 'Ajouter un nouvel employé'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    value={form.prenom}
                    onChange={e=>setForm(f=>({...f, prenom: e.target.value}))}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    value={form.nom}
                    onChange={e=>setForm(f=>({...f, nom: e.target.value}))}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Genre</label>
                  <select
                    value={form.genre}
                    onChange={e=>setForm(f=>({...f, genre: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Sélectionner</option>
                    {genres.map(g=> <option key={g}>{g}</option>)}
                  </select>
                </div>
                {/* État civil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">État civil</label>
                  <select
                    value={form.etat_civil}
                    onChange={e=>setForm(f=>({...f, etat_civil: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Sélectionner</option>
                    {etatsCivils.map(e=> <option key={e}>{e}</option>)}
                  </select>
                </div>
                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date de naissance</label>
                  <input
                    type="date"
                    value={form.date_naissance}
                    onChange={e=>setForm(f=>({...f, date_naissance: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Lieu de naissance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Lieu de naissance</label>
                  <input
                    value={form.lieu_naissance}
                    onChange={e=>setForm(f=>({...f, lieu_naissance: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Nationalité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationalité</label>
                  <input
                    value={form.nationalite}
                    onChange={e=>setForm(f=>({...f, nationalite: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Rue / Numéro */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rue</label>
                    <input
                      value={form.rue}
                      onChange={e=>setForm(f=>({...f, rue: e.target.value}))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Numéro</label>
                    <input
                      value={form.numero}
                      onChange={e=>setForm(f=>({...f, numero: e.target.value}))}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                {/* Ville */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <input
                    value={form.ville}
                    onChange={e=>setForm(f=>({...f, ville: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Code postal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code postal</label>
                  <input
                    type="number"
                    value={form.code_postal}
                    onChange={e=>setForm(f=>({...f, code_postal: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Pays */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pays</label>
                  <input
                    value={form.pays}
                    onChange={e=>setForm(f=>({...f, pays: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Type identité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type d'identité</label>
                  <select
                    value={form.type_identite}
                    onChange={e=>setForm(f=>({...f, type_identite: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Sélectionner</option>
                    {typesId.map(t=> <option key={t}>{t}</option>)}
                  </select>
                </div>
                {/* N° identité */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">N° identité</label>
                  <input
                    value={form.numero_identite}
                    onChange={e=>setForm(f=>({...f, numero_identite: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Date délivrance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date délivrance</label>
                  <input
                    type="date"
                    value={form.date_delivrance}
                    onChange={e=>setForm(f=>({...f, date_delivrance: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e=>setForm(f=>({...f, email: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Tél GSM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tél GSM</label>
                  <input
                    value={form.tel_gsm}
                    onChange={e=>setForm(f=>({...f, tel_gsm: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Tél fixe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tél fixe</label>
                  <input
                    value={form.tel_fixe}
                    onChange={e=>setForm(f=>({...f, tel_fixe: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Diplôme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Diplôme</label>
                  <input
                    value={form.diplome}
                    onChange={e=>setForm(f=>({...f, diplome: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Domaine */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Domaine</label>
                  <input
                    value={form.domaine}
                    onChange={e=>setForm(f=>({...f, domaine: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Grade */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <input
                    value={form.grade}
                    onChange={e=>setForm(f=>({...f, grade: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Expérience académique */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Expérience académique</label>
                  <textarea
                    value={form.experience_academique}
                    onChange={e=>setForm(f=>({...f, experience_academique: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Expérience professionnelle */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Expérience professionnelle</label>
                  <textarea
                    value={form.experience_professionnelle}
                    onChange={e=>setForm(f=>({...f, experience_professionnelle: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Autre diplôme */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Autre diplôme</label>
                  <input
                    value={form.autre_diplome}
                    onChange={e=>setForm(f=>({...f, autre_diplome: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* CV (URL ou texte) */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">CV (URL ou texte)</label>
                  <textarea
                    value={form.cv}
                    onChange={e=>setForm(f=>({...f, cv: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Situation actuelle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Situation actuelle</label>
                  <input
                    value={form.situation_actuelle}
                    onChange={e=>setForm(f=>({...f, situation_actuelle: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Nombre d'heures */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nombre d'heures</label>
                  <input
                    type="number"
                    value={form.nombre_heure}
                    onChange={e=>setForm(f=>({...f, nombre_heure: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Établissement d'origine */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Établissement d'origine</label>
                  <input
                    value={form.etablissement_origine}
                    onChange={e=>setForm(f=>({...f, etablissement_origine: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Date autorisation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date autorisation</label>
                  <input
                    type="date"
                    value={form.date_autorisation}
                    onChange={e=>setForm(f=>({...f, date_autorisation: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Date recrutement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date recrutement</label>
                  <input
                    type="date"
                    value={form.date_recrutement}
                    onChange={e=>setForm(f=>({...f, date_recrutement: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* N° affiliation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">N° affiliation</label>
                  <input
                    value={form.numero_affiliation}
                    onChange={e=>setForm(f=>({...f, numero_affiliation: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Catégorie */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Catégorie</label>
                  <input
                    value={form.categorie}
                    onChange={e=>setForm(f=>({...f, categorie: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* RIB */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">RIB</label>
                  <input
                    value={form.rib}
                    onChange={e=>setForm(f=>({...f, rib: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Login */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Login</label>
                  <input
                    value={form.login}
                    onChange={e=>setForm(f=>({...f, login: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                  <input
                    type="password"
                    value={form.pswd}
                    onChange={e=>setForm(f=>({...f, pswd: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Date modification */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date modification</label>
                  <input
                    type="datetime-local"
                    value={form.date_modification}
                    onChange={e=>setForm(f=>({...f, date_modification: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Établissement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Établissement</label>
                  <input
                    value={form.etablissement}
                    onChange={e=>setForm(f=>({...f, etablissement: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Rôle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <select
                    value={form.role}
                    onChange={e=>setForm(f=>({...f, role: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  >
                    {roles.map(r=> <option key={r}>{r}</option>)}
                  </select>
                </div>
                {/* Salaire fixe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salaire fixe</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.salaire_fixe}
                    onChange={e=>setForm(f=>({...f, salaire_fixe: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                {/* Salaire restant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Salaire restant</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.salaire_restant}
                    onChange={e=>setForm(f=>({...f, salaire_restant: e.target.value}))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={()=>{ setShowForm(false); resetForm() }}
                  className="px-4 py-2 border rounded"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {form.id ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
