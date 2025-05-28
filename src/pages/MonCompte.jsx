// src/pages/Communication.jsx
import React, { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import {
  MessageCircle,
  Bell,
  Clipboard,
  Search,
  Send,
  Plus,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Communication() {
  const [tab, setTab] = useState('messagerie')
  const [search, setSearch] = useState('')

  // — Messagerie —
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [recipient, setRecipient] = useState(null)
  const [draft, setDraft] = useState('')

  // — Annonces —
  const [annonces, setAnnonces] = useState([])
  const [newAnnonce, setNewAnnonce] = useState({ title: '', content: '' })

  // — Tableau d’affichage —
  const [board, setBoard] = useState([])
  const [newInfo, setNewInfo] = useState('')

  const api = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  useEffect(() => {
    async function loadAll() {
      try {
        const [rMsgs, rAnons, rBoard] = await Promise.all([
          fetch(`${api}/messages`, { headers: { Accept: 'application/json' } }),
          fetch(`${api}/annonces`, { headers: { Accept: 'application/json' } }),
          fetch(`${api}/board`, { headers: { Accept: 'application/json' } }),
        ])

        const msgs  = rMsgs.ok  ? await rMsgs.json()  : []
        const anons = rAnons.ok ? await rAnons.json() : []
        const b     = rBoard.ok ? await rBoard.json() : []

        setMessages(msgs)
        setAnnonces(anons)
        setBoard(b)

        // lookup users for messagerie
        const ids = Array.from(new Set(
          msgs.flatMap(m => [m.from_user, m.to_user]).filter(Boolean)
        ))
        if (ids.length) {
          const rUsers = await fetch(
            `${api}/messages/users?ids=${ids.join(',')}`,
            { headers: { Accept: 'application/json' } }
          )
          if (rUsers.ok) {
            const us = await rUsers.json()
            setUsers(us)
            setCurrentUser(us[0]?.id || null)
            setRecipient(us[1]?.id || us[0]?.id || null)
          }
        }
      } catch (err) {
        console.error('Communication load error', err)
      }
    }
    loadAll()
  }, [api])

  const sendMessage = async () => {
    if (!draft.trim() || !currentUser || !recipient) return
    try {
      const res = await fetch(`${api}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ from_user: currentUser, to_user: recipient, text: draft })
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const m = await res.json()
      setMessages(ms => [...ms, m])
      setDraft('')
    } catch (err) {
      console.error('Error sending message', err)
    }
  }

  const postAnnonce = async () => {
    if (!newAnnonce.title.trim() || !currentUser) return
    try {
      const res = await fetch(`${api}/annonces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...newAnnonce, created_by: currentUser })
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const a = await res.json()
      setAnnonces(an => [a, ...an])
      setNewAnnonce({ title: '', content: '' })
    } catch (err) {
      console.error('Error posting annonce', err)
    }
  }

  const postInfo = async () => {
    if (!newInfo.trim() || !currentUser) return
    try {
      const res = await fetch(`${api}/board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ info: newInfo, created_by: currentUser })
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const i = await res.json()
      setBoard(b => [i, ...b])
      setNewInfo('')
    } catch (err) {
      console.error('Error posting info', err)
    }
  }

  const deleteInfo = async id => {
    try {
      const res = await fetch(`${api}/board/${id}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' }
      })
      if (!res.ok) throw new Error(`Status ${res.status}`)
      setBoard(b => b.filter(x => x.id !== id))
    } catch (err) {
      console.error('Error deleting info', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Onglets */}
          <div className="flex items-center gap-4 mb-6">
            {[
              { key: 'messagerie', icon: MessageCircle, label: 'Messagerie' },
              { key: 'annonces',   icon: Bell,          label: 'Annonces'   },
              { key: 'board',      icon: Clipboard,     label: 'Tableau'    }
            ].map(def => (
              <button
                key={def.key}
                onClick={() => setTab(def.key)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-xl transition',
                  tab === def.key
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                )}
              >
                <def.icon className="w-5 h-5" />
                {def.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="mb-6 relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          {/* Contenu par onglet */}
          {tab === 'messagerie' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Messagerie interne</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vous êtes :</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={currentUser || ''}
                    onChange={e => setCurrentUser(+e.target.value)}
                  >
                    <option value="">– choisissez –</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire :</label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={recipient || ''}
                    onChange={e => setRecipient(+e.target.value)}
                  >
                    <option value="">– choisissez –</option>
                    {users.filter(u => u.id !== currentUser).map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-gray-200 mb-4">
                {messages
                  .filter(m => {
                    const fromName = users.find(u => u.id === m.from_user)?.name || ''
                    return fromName.toLowerCase().includes(search.toLowerCase())
                        || m.text.toLowerCase().includes(search.toLowerCase())
                  })
                  .map(m => (
                    <div key={m.id} className="py-2">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">
                          {users.find(u => u.id === m.from_user)?.name}
                        </span>{' '}
                        à{' '}
                        {new Date(m.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                      <div className="mt-1">{m.text}</div>
                    </div>
                  ))
                }
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-xl px-4 py-2"
                  placeholder="Écrire un message..."
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button
                  onClick={sendMessage}
                  className="bg-brand-blue text-white rounded-xl px-4 flex items-center gap-2 hover:bg-brand-darkBlue"
                >
                  <Send className="w-5 h-5" /> Envoyer
                </button>
              </div>
            </div>
          )}

          {tab === 'annonces' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Annonces & notifications</h2>
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {annonces
                  .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
                  .map(a => (
                    <div key={a.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{a.title}</h3>
                        <span className="text-sm text-gray-500">
                          {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{a.content}</p>
                    </div>
                  ))
                }
              </div>
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Nouvelle annonce</h3>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 mb-2"
                  placeholder="Titre"
                  value={newAnnonce.title}
                  onChange={e => setNewAnnonce(n => ({ ...n, title: e.target.value }))}
                />
                <textarea
                  rows={3}
                  className="w-full border rounded-md px-3 py-2 mb-2"
                  placeholder="Contenu"
                  value={newAnnonce.content}
                  onChange={e => setNewAnnonce(n => ({ ...n, content: e.target.value }))}
                />
                <button
                  onClick={postAnnonce}
                  className="bg-green-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-green-700"
                >
                  <Plus className="w-5 h-5" /> Publier
                </button>
              </div>
            </div>
          )}

          {tab === 'board' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Tableau d’affichage</h2>
              <ul className="divide-y divide-gray-200 mb-4">
                {board
                  .filter(b => b.info.toLowerCase().includes(search.toLowerCase()))
                  .map(b => (
                    <li key={b.id} className="py-2 flex justify-between items-center">
                      <span>{b.info}</span>
                      <button
                        onClick={() => deleteInfo(b.id)}
                        className="text-red-600 hover:underline"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))
                }
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 border rounded-xl px-4 py-2"
                  placeholder="Ajouter une info"
                  value={newInfo}
                  onChange={e => setNewInfo(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && postInfo()}
                />
                <button
                  onClick={postInfo}
                  className="bg-brand-blue text-white rounded-xl px-4 flex items-center gap-2 hover:bg-brand-darkBlue"
                >
                  <Plus className="w-5 h-5" /> Ajouter
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  )
}