// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Bar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Calendar, Wallet, Users2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const [nbConges, setNbConges] = useState(0)
  const [nbDemandesFin, setNbDemandesFin] = useState(0)
  const [nbEmployes, setNbEmployes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      axios.get(`${API}/api/conges`),
      axios.get(`${API}/api/demandes_financieres`),
      axios.get(`${API}/api/enseignant`)
    ])
      .then(([resC, resDF, resE]) => {
        setNbConges(resC.data.length)
        setNbDemandesFin(resDF.data.length)
        setNbEmployes(resE.data.length)
      })
      .catch(err => console.error('Dashboard fetch error', err))
      .finally(() => setLoading(false))
  }, [])

  const labels = ['Congés', "Demandes d'avances", "Employées"]
  const counts = [nbConges, nbDemandesFin, nbEmployes]

  // bleu, jaune, vert pour Employées
  const COLORS = ['#3B82F6', '#FBBF24', '#10B981']

  const barData = { labels, datasets: [{ label: 'Nombre', data: counts, backgroundColor: COLORS }] }
  const doughnutData = { labels, datasets: [{ label: 'Répartition', data: counts, backgroundColor: COLORS }] }

  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { x: { title: { display: true, text: 'Catégorie' } }, y: { title: { display: true, text: 'Nombre' }, beginAtZero: true } }
  }

  const doughnutOptions = { responsive: true, plugins: { legend: { position: 'right' } } }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <header className="py-8 mb-8 bg-white border-b">
        <br></br>
        <br></br>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-brand-blue">Tableau de bord RH</h1>
          <p className="mt-1 text-gray-600">Vue d’ensemble de vos congés, finances et effectif</p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {Array(3).fill().map((_,i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card title="Congés" count={nbConges} icon={<Calendar className="w-8 h-8 text-blue-500" />} path="/demandes-congés" color="blue" />
              <Card title="Demandes d'avances" count={nbDemandesFin} icon={<Wallet className="w-8 h-8 text-yellow-500" />} path="/demandes-d'avances" color="yellow" />
              <Card title="Employées" count={nbEmployes} icon={<Users2 className="w-8 h-8 text-green-500" />} path="/employées" color="green" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              <ChartWrapper title="Nombre par catégorie">
                <Bar data={barData} options={barOptions} />
              </ChartWrapper>
              <ChartWrapper title="Répartition %">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </ChartWrapper>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function Card({ title, count, icon, path, color }) {
  const base = {
    blue: 'border-blue-200 hover:border-blue-400',
    yellow: 'border-yellow-200 hover:border-yellow-400',
    green: 'border-green-200 hover:border-green-400'
  }
  return (
    <Link
      to={path}
      className={`group flex items-center space-x-4 p-6 bg-white border rounded-xl shadow-sm transition ${base[color]}`}
    >
      <div className="p-3 bg-gray-100 rounded-full transition group-hover:bg-opacity-90">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        <p className="text-4xl font-bold text-gray-900">{count}</p>
      </div>
    </Link>
  )
}

function ChartWrapper({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}