// src/pages/Promos.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import {
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

const statuses = [
  { label: 'Tous',       value: ''           },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Accepté',    value: 'accepte'    },
  { label: 'Refusé',     value: 'refuse'     }
]

export default function Promos() {
  const [conges,       setConges]       = useState([])
  const [filtered,     setFiltered]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showDetail,   setShowDetail]   = useState(false)
  const [detailConge,  setDetailConge]  = useState(null)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // 1️⃣ Chargement initial depuis l'API
  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API}/api/conges`)
      .then(({ data }) => {
        const ui = data.map(c => ({
          id:             c.id,
          enseignant:     { nom: c.user.nom, prenom: c.user.prenom },
          date_debut:     c.date_debut.slice(0, 10),
          date_fin:       c.date_fin.slice(0, 10),
          motif:          c.motif,
          statut:         c.etat,
          nbr_jours_conge:c.nbr_jours_conge
        }))
        setConges(ui)
        setFiltered(ui)
      })
      .catch(err => {
        console.error('Erreur chargement congés :', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // 2️⃣ Recherche + filtres
  useEffect(() => {
    let tmp = [...conges]
    if (search) {
      const s = search.toLowerCase()
      tmp = tmp.filter(c =>
        `${c.enseignant.nom} ${c.enseignant.prenom}`.toLowerCase().includes(s)
      )
    }
    if (statusFilter) {
      tmp = tmp.filter(c => c.statut === statusFilter)
    }
    setFiltered(tmp)
  }, [search, statusFilter, conges])

  // 3️⃣ Mettre à jour le statut
  const changeStatut = (id, nouveau) => {
    axios
      .put(`${API}/api/conges/${id}`, { etat: nouveau })
      .then(({ data }) => {
        setConges(cs =>
          cs.map(c =>
            c.id === id
              ? { ...c, statut: data.etat }
              : c
          )
        )
      })
      .catch(err => console.error('Erreur update statut :', err))
  }

  // 4️⃣ Supprimer
  const deleteConge = id => {
    if (!window.confirm('Confirmer la suppression ?')) return
    axios
      .delete(`${API}/api/conges/${id}`)
      .then(() => {
        setConges(cs => cs.filter(c => c.id !== id))
      })
      .catch(err => console.error('Erreur suppression :', err))
  }

  // 5️⃣ Ouvrir le modal de détail
  const viewDetail = c => {
    setDetailConge(c)
    setShowDetail(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link
                to="/"
                className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue transition"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour tableau de bord
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-brand-blue">
                Gestion des demandes de congé
              </h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher enseignant..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Filtrer par statut
                </h4>
                <div className="space-y-2">
                  {statuses.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setStatusFilter(s.value)}
                      className={cn(
                        'w-full text-left py-2 px-3 rounded-lg transition',
                        statusFilter === s.value
                          ? 'bg-brand-lightBlue bg-opacity-30 text-brand-blue'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className="flex-grow">
              {loading ? (
                <div className="bg-white rounded-xl p-10 text-center shadow">
                  Chargement...
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center shadow">
                  <p className="text-gray-500">Aucune demande ne correspond aux filtres.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(c => {
                    const isFinal = c.statut !== 'en_attente'
                    return (
                      <div
                        key={c.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                      >
                        <div className="p-4 flex-grow">
                          <h3 className="font-semibold text-xl text-brand-blue">
                            {c.enseignant.nom} {c.enseignant.prenom}
                          </h3>
                          <p className="flex items-center text-gray-600 mt-2">
                            <Calendar className="w-4 h-4 mr-1" />
                            {c.date_debut} → {c.date_fin}
                          </p>
                          <p className="mt-2 text-gray-700">{c.motif}</p>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                          {/* Bouton œil */}
                          <button
                            onClick={() => viewDetail(c)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Eye className="w-5 h-5"/>
                          </button>

                          {/* Statut badge */}
                          <span
                            className={cn(
                              'inline-block px-3 py-1 rounded-full text-sm font-medium',
                              c.statut === 'en_attente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : c.statut === 'accepte'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            )}
                          >
                            {statuses.find(s => s.value === c.statut)?.label}
                          </span>
                        </div>
                        <div className="p-4 border-t border-gray-100 space-y-2">
                          <div className="flex justify-between">
                            <button
                              onClick={() => changeStatut(c.id, 'accepte')}
                              disabled={isFinal}
                              className={cn(
                                'flex items-center gap-1',
                                isFinal
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-green-600 hover:underline'
                              )}
                            >
                              <CheckCircle className="w-5 h-5" /> Approuver
                            </button>
                            <button
                              onClick={() => changeStatut(c.id, 'refuse')}
                              disabled={isFinal}
                              className={cn(
                                'flex items-center gap-1',
                                isFinal
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-red-600 hover:underline'
                              )}
                            >
                              <XCircle className="w-5 h-5" /> Refuser
                            </button>
                          </div>
                          <div className="flex justify-between">
                            <button
                              onClick={() => changeStatut(c.id, 'en_attente')}
                              disabled={isFinal}
                              className={cn(
                                'flex items-center gap-1',
                                isFinal
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-yellow-600 hover:underline'
                              )}
                            >
                              <RefreshCcw className="w-5 h-5" /> Remettre en attente
                            </button>
                            <button
                              onClick={() => deleteConge(c.id)}
                              className="flex items-center gap-1 text-gray-600 hover:underline"
                            >
                              <XCircle className="w-5 h-5" /> Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal Détail du solde */}
      {showDetail && detailConge && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              Solde restant de {detailConge.enseignant.prenom} {detailConge.enseignant.nom}
            </h2>
            <p className="text-lg">
              {detailConge.nbr_jours_conge} jours
            </p>
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
    </div>
  )
}
