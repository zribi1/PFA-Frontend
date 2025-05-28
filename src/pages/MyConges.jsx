// ✅ This is the same Conges.jsx logic but adapted to "MyConge" for employees
// Rename the file to: src/pages/MyConge.jsx

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NavbarEmp from '../components/layout/NavbarEmp'
import Footer from '../components/layout/Footer'
import {
  Calendar,
  Eye,
  PlusCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const statuses = [
  { label: 'Tous',       value: ''           },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Accepté',    value: 'accepte'    },
  { label: 'Refusé',     value: 'refuse'     }
]

export default function MyConge() {
  const [conges,       setConges]       = useState([])
  const [filtered,     setFiltered]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [showDetail,   setShowDetail]   = useState(false)
  const [detailConge,  setDetailConge]  = useState(null)
  const [showForm,     setShowForm]     = useState(false)
  const [form,         setForm]         = useState({ motif: '', date_debut: '', date_fin: '' })

  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  useEffect(() => {
    loadConges()
  }, [])

  const loadConges = () => {
    setLoading(true)
    axios.get(`${API}/api/mes_conges`)
      .then(({ data }) => {
        const ui = data.map(c => ({
          id:             c.id,
          date_debut:     c.date_debut.slice(0, 10),
          date_fin:       c.date_fin.slice(0, 10),
          motif:          c.motif,
          statut:         c.etat,
          nbr_jours_conge:c.nbr_jours_conge
        }))
        setConges(ui)
        setFiltered(ui)
      })
      .catch(err => console.error('Erreur chargement congés :', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let tmp = [...conges]
    if (statusFilter) tmp = tmp.filter(c => c.statut === statusFilter)
    setFiltered(tmp)
  }, [statusFilter, conges])

  const viewDetail = c => {
    setDetailConge(c)
    setShowDetail(true)
  }

  const handleFormSubmit = e => {
    e.preventDefault()
    axios.post(`${API}/api/conges`, form)
      .then(() => {
        setShowForm(false)
        setForm({ motif: '', date_debut: '', date_fin: '' })
        loadConges()
      })
      .catch(err => alert('Erreur lors de la demande : ' + err))
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarEmp />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-brand-blue">Mes demandes de congé</h1>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5" /> Nouvelle demande
            </button>
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
                  <p className="text-gray-500">Aucune demande de congé trouvée.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(c => (
                    <div
                      key={c.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                    >
                      <div className="p-4 flex-grow">
                        <p className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {c.date_debut} → {c.date_fin}
                        </p>
                        <p className="mt-2 text-gray-700">{c.motif}</p>
                      </div>
                      <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => viewDetail(c)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
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
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal */}
      {showDetail && detailConge && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Détail du congé</h2>
            <p><strong>Motif :</strong> {detailConge.motif}</p>
            <p><strong>Du :</strong> {detailConge.date_debut}</p>
            <p><strong>Au :</strong> {detailConge.date_fin}</p>
            <p><strong>Nombre de jours :</strong> {detailConge.nbr_jours_conge}</p>
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

      {/* Modal Nouvelle Demande */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Nouvelle demande de congé</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Motif</label>
                <textarea
                  value={form.motif}
                  onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  value={form.date_debut}
                  onChange={e => setForm(f => ({ ...f, date_debut: e.target.value }))}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="date"
                  value={form.date_fin}
                  onChange={e => setForm(f => ({ ...f, date_fin: e.target.value }))}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
