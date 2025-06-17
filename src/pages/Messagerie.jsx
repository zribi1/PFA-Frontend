import React, { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { Send } from 'lucide-react'

export default function Messagerie() {
  const api = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:8000/api'
  console.log("🛠️ API base URL:", api)

  const [enseignants, setEnseignants] = useState([])
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null) // 👤 user
  const [selectedUser, setSelectedUser] = useState(null) // 👤 enseignant
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'))
    if (!localUser?.email) return

    const loadAll = async () => {
      try {
        const [ensRes, userRes, msgRes] = await Promise.all([
          fetch(`${api}/enseignant`),
          fetch(`${api}/users`),
          fetch(`${api}/messagesens`)
        ])

        const [enseignantsData, usersData, messagesData] = await Promise.all([
          ensRes.json(),
          userRes.json(),
          msgRes.json()
        ])

        setEnseignants(enseignantsData)
        setUsers(usersData)
        setMessages(messagesData)

        // Récupérer le user connecté
        const user = usersData.find(u => u.email === localUser.email)
        if (user) setCurrentUser(user)

        console.log("👤 Utilisateur connecté:", user)
      } catch (err) {
        console.error("❌ Erreur de chargement :", err)
      }
    }

    loadAll()
  }, [])

  const getReceiverUserId = (enseignant) => {
    if (!enseignant || !enseignant.email) return null
    const matchedUser = users.find(u => u.email === enseignant.email)
    return matchedUser?.id || null
  }

  const sendMessage = async () => {
    if (!draft.trim() || !selectedUser || !currentUser) return

    const senderId = currentUser?.id
    const receiverId = getReceiverUserId(selectedUser)

    if (!senderId || !receiverId) {
      console.error("❌ IDs invalides :", { senderId, receiverId })
      alert("❌ Identifiants utilisateurs manquants")
      return
    }

    const msg = {
      sender_id: senderId,
      reciver_id: receiverId,
      body: draft,
      status: 0
    }

    const url = `${api}/messagesens`
    console.log("📨 Message envoyé :", msg)

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg)
      })

      if (!res.ok) throw new Error("Erreur serveur")

      const newMsg = await res.json()
      setMessages(prev => [...prev, newMsg])
      setDraft('')
    } catch (err) {
      console.error('❌ Envoi échoué :', err)
      alert("Erreur lors de l'envoi.")
    }
  }

  const filteredUsers = enseignants.filter(
    u => u.email !== currentUser?.email && u.prenom.toLowerCase().includes(search.toLowerCase())
  )

  const receiverId = selectedUser ? getReceiverUserId(selectedUser) : null

  const conversation = selectedUser
    ? messages.filter(
        m =>
          (m.sender_id === currentUser?.id && m.reciver_id === receiverId) ||
          (m.reciver_id === currentUser?.id && m.sender_id === receiverId)
      )
    : []

  return (
<div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 flex overflow-hidden h-[calc(100vh-64px)]">
        {/* Left Panel */}
        <div className="w-1/3 border-r bg-white p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Discussions</h2>
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Rechercher un enseignant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {filteredUsers.map(user => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${
                selectedUser?.id === user.id ? 'bg-blue-100' : ''
              }`}
            >
              {user.prenom} {user.nom}
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div className="w-2/3 p-4 flex flex-col justify-between">
          {selectedUser ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {conversation.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-xs p-3 rounded-lg ${
                      m.sender_id === currentUser?.id
                        ? 'ml-auto bg-blue-500 text-white'
                        : 'mr-auto bg-gray-200'
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center">
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1 border rounded-l p-2"
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 my-auto">
              Sélectionnez un enseignant pour commencer la conversation.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
