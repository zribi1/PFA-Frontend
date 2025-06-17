import React, { useEffect, useState } from 'react'
import { Plus, Calendar, ArrowLeft } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Link } from 'react-router-dom'

export default function Annonces() {
  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  const [annonces, setAnnonces] = useState([])
  const [enseignantId, setEnseignantId] = useState(null)
  const [newAnnonce, setNewAnnonce] = useState({ title: '', content: '' })
  const [search, setSearch] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user'))
    if (u?.email) {
      setCurrentUser(u)

      // 🔍 Match enseignant by email
      fetch(`${api}/enseignant`)
        .then(r => r.json())
        .then(data => {
          const enseignant = data.find(e => e.email === u.email)
          if (enseignant) setEnseignantId(enseignant.id)
          else console.warn("⚠️ Aucun enseignant trouvé avec cet email.")
        })
        .catch(err => console.error("Erreur lors de la récupération des enseignants", err))
    }

    // 📡 Load annonces
    fetch(`${api}/annonces`)
      .then(r => r.json())
      .then(setAnnonces)
      .catch(err => console.error("Erreur lors du chargement des annonces :", err))
  }, [])

  const postAnnonce = async () => {
    if (!newAnnonce.title.trim() || !enseignantId) return

    const payload = {
      ...newAnnonce,
      created_by: enseignantId,
    }

    try {
      const res = await fetch(`${api}/annonces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errText = await res.text()
        console.error('Erreur serveur :', res.status, errText)
        return
      }

      const saved = await res.json()
      setAnnonces(prev => [saved, ...prev])
      setNewAnnonce({ title: '', content: '' })
    } catch (err) {
      console.error('Erreur réseau :', err)
    }
  }

  const annoncesEnvoyees = annonces.filter(
    a => a.created_by === enseignantId && a.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue transition">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour tableau de bord
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-brand-blue">Annonces publiées</h1>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un titre..."
                className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Plus className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Formulaire annonce */}
          <div className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Nouvelle annonce</h2>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Titre"
              value={newAnnonce.title}
              onChange={e => setNewAnnonce(n => ({ ...n, title: e.target.value }))}
            />
            <textarea
              className="border p-2 rounded w-full mb-4"
              placeholder="Contenu"
              rows="4"
              value={newAnnonce.content}
              onChange={e => setNewAnnonce(n => ({ ...n, content: e.target.value }))}
            />
            <button
              onClick={postAnnonce}
              className="bg-green-600 text-white rounded px-4 py-2 flex items-center gap-2 hover:bg-green-700"
            >
              <Plus className="w-5 h-5" /> Publier l'annonce
            </button>
          </div>

          {/* Liste des annonces envoyées */}
          <section>
            {annoncesEnvoyees.length === 0 ? (
              <div className="bg-white rounded-xl p-10 text-center shadow">
                <p className="text-gray-500">Aucune annonce envoyée pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annoncesEnvoyees.map(a => (
                  <div key={a.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                    <div className="p-4 flex-grow">
                      <h3 className="font-semibold text-xl text-brand-blue mb-2">{a.title}</h3>
                      <p className="text-gray-700 mb-4">{a.content}</p>
                      <p className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(a.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
