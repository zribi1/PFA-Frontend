import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Doughnut, Bar } from 'react-chartjs-2'
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
import { Calendar, Users2, User, PieChart as PieIcon } from 'lucide-react'
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

// Constantes globales pour les libellés de mois
const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc']

// Fonction utilitaire : renvoie le nombre de jours ouvrés pour un mois donné (0-indexé)
function countWeekdaysInMonth(year, month) {
  const date = new Date(year, month, 1)
  let count = 0
  while (date.getMonth() === month) {
    const day = date.getDay()
    if (day !== 0 && day !== 6) {
      count++
    }
    date.setDate(date.getDate() + 1)
  }
  return count
}

export default function Dashboard() {
  const API = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  // États “classiques”
  const [nbConges, setNbConges] = useState(0)
  const [nbDemandesFin, setNbDemandesFin] = useState(0)
  const [nbEmployes, setNbEmployes] = useState(0)

  // Nouveaux états pour les données demandées
  const [genderDist, setGenderDist] = useState({})                 // { Homme: 10, Femme: 8 }
  const [departementsDist, setDepartementsDist] = useState({})     // { "Informatique": 5, ... }
  const [empAvecConge, setEmpAvecConge] = useState(0)              // nombre distinct d'enseignants en /conges
  const [absentHoursForMonth, setAbsentHoursForMonth] = useState(0)// total d'heures d'absence du mois
  const [tauxAbsent, setTauxAbsent] = useState(0)                  // en %

  // Nouveaux états pour les analyses demandées
  const [hireDistribution, setHireDistribution] = useState(Array(12).fill(0))     // [nombre de recrues par mois courant]
  const [absentByDept, setAbsentByDept] = useState({})                            // { Dept1: %, Dept2: %, ... }

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([
      axios.get(`${API}/enseignant`),
      axios.get(`${API}/conges`),
      axios.get(`${API}/absencesens`)
    ])
      .then(([resEns, resC, resAbs]) => {
        const enseignants = resEns.data
        const conges = resC.data
        const absences = resAbs.data

        // 1) Comptages de base
        setNbEmployes(enseignants.length)
        setNbConges(conges.length)
        setNbDemandesFin(0) // <-- si vous aviez /demandes_financieres, adaptez ici

        // 2) Répartition des genres
        const distGenre = enseignants.reduce((acc, e) => {
          const g = (e.gender || e.genre || 'Inconnu').trim()
          acc[g] = (acc[g] || 0) + 1
          return acc
        }, {})
        setGenderDist(distGenre)

        // 3) Répartition des départements
        const distDept = enseignants.reduce((acc, e) => {
          const d = (e.domaine || 'Inconnu').trim()
          acc[d] = (acc[d] || 0) + 1
          return acc
        }, {})
        setDepartementsDist(distDept)

        // 4) Nombre d'employés ayant demandé au moins 1 congé
        const uniqueIds = new Set(conges.map(c => c.enseignant_id))
        setEmpAvecConge(uniqueIds.size)

        // 5) Calcul du taux d'absentéisme pour le mois courant
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()

        let totalAbsHr = 0
        const idToDept = {}
        enseignants.forEach(e => {
          idToDept[e.id] = (e.domaine || 'Inconnu').trim()
        })

        absences.forEach(a => {
          if (!a.jour) return
          const d = new Date(a.jour)
          if (isNaN(d) || d.getFullYear() !== year || d.getMonth() !== month) return

          if ((a.type_absence === 'heures' || a.type_absence === 'seances') && a.debut_heure && a.fin_heure) {
            const start = new Date(`1970-01-01T${a.debut_heure}`)
            const end = new Date(`1970-01-01T${a.fin_heure}`)
            const diffH = (end - start) / 3600000
            if (!isNaN(diffH) && diffH > 0) totalAbsHr += diffH
          }
        })
        setAbsentHoursForMonth(totalAbsHr)

        const nbWeekdays = countWeekdaysInMonth(year, month)
        const totalPossibleH = enseignants.length * 8 * nbWeekdays
        const taux = totalPossibleH > 0 ? (totalAbsHr / totalPossibleH) * 100 : 0
        setTauxAbsent(parseFloat(taux.toFixed(2)))

        // 6) Distribution des nouvelles recrues (mois/année)
        const hiresThisYear = Array(12).fill(0)
        enseignants.forEach(e => {
          if (!e.date_recrutement) return
          const dEmb = new Date(e.date_recrutement)
          if (!isNaN(dEmb) && dEmb.getFullYear() === year) {
            const m = dEmb.getMonth() // 0-indexé
            hiresThisYear[m] += 1
          }
        })
        setHireDistribution(hiresThisYear)

        // 7) Taux d’absentéisme par département (pour le mois courant)
        //    On calcule heures d'absence par département
        const hoursByDept = {}
        Object.keys(distDept).forEach(dept => {
          hoursByDept[dept] = 0
        })

        absences.forEach(a => {
          if (!a.jour) return
          const d = new Date(a.jour)
          if (isNaN(d) || d.getFullYear() !== year || d.getMonth() !== month) return

          if ((a.type_absence === 'heures' || a.type_absence === 'seances') && a.debut_heure && a.fin_heure) {
            const start = new Date(`1970-01-01T${a.debut_heure}`)
            const end = new Date(`1970-01-01T${a.fin_heure}`)
            const diffH = (end - start) / 3600000
            if (!isNaN(diffH) && diffH > 0) {
              const dept = idToDept[a.enseignant_id] || 'Inconnu'
              hoursByDept[dept] = (hoursByDept[dept] || 0) + diffH
            }
          }
        })

        // Calculer le taux pour chaque département
        const tauxByDept = {}
        Object.entries(distDept).forEach(([dept, countDept]) => {
          const possibleHDept = countDept * 8 * nbWeekdays
          const absentDeptHr = hoursByDept[dept] || 0
          tauxByDept[dept] = possibleHDept > 0
            ? parseFloat(((absentDeptHr / possibleHDept) * 100).toFixed(2))
            : 0
        })
        setAbsentByDept(tauxByDept)
      })
      .catch(err => {
        console.error('Dashboard fetch error', err)
        setError('Impossible de récupérer les données.')
      })
      .finally(() => setLoading(false))
  }, [])

  // Prépare les données pour Chart.js
  const doughnutGenderData = {
    labels: Object.keys(genderDist),
    datasets: [{
      data: Object.values(genderDist),
      backgroundColor: ['#3B82F6', '#EF4444', '#FBBF24', '#10B981']
    }]
  }

  const doughnutDeptData = {
    labels: Object.keys(departementsDist),
    datasets: [{
      data: Object.values(departementsDist),
      backgroundColor: [
        '#3B82F6', '#EF4444', '#FBBF24', '#10B981',
        '#8B5CF6', '#F472B6', '#0EA5E9', '#F97316'
      ]
    }]
  }

  const barHireData = {
    labels: MONTH_LABELS,
    datasets: [{
      label: 'Recrues',
      data: hireDistribution,
      backgroundColor: '#3B82F6'
    }]
  }

  const barAbsentDeptData = {
    labels: Object.keys(absentByDept),
    datasets: [{
      label: 'Taux d\'absentéisme (%)',
      data: Object.values(absentByDept),
      backgroundColor: '#EF4444'
    }]
  }

  return (
    <div className="min-h-screen pt-14 flex flex-col bg-gray-50">
      <Navbar />

      <header className="py-8 mb-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-brand-blue">Tableau de bord RH</h1>
          <p className="mt-1 text-gray-600">
            Suivi des congés, répartition par genre/département, recrutements et absentéisme
          </p>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            {/*------------ Première ligne : cartes de synthèse ------------*/}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              <Card
                title="Total enseignants"
                count={nbEmployes}
                icon={<Users2 className="w-8 h-8 text-blue-500" />}
                color="blue"
              />
              <Card
                title="Demandes de congés"
                count={nbConges}
                icon={<Calendar className="w-8 h-8 text-green-500" />}
                color="green"
              />
              <Card
                title="Emp. avec au moins 1 congé"
                count={empAvecConge}
                icon={<User className="w-8 h-8 text-yellow-500" />}
                color="yellow"
              />
              <Card
                title="Taux d'absentéisme (%)"
                count={`${tauxAbsent} %`}
                icon={<PieIcon className="w-8 h-8 text-red-500" />}
                color="red"
              />
            </div>

            {/*------------ Deuxième ligne : graphiques principaux ------------*/}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Répartition par genre */}
              <ChartWrapper title="Répartition par genre">
                {Object.keys(genderDist).length > 0 ? (
                  <Doughnut
                    data={doughnutGenderData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'bottom' } }
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">Pas de données de genre</p>
                )}
              </ChartWrapper>

              {/* Répartition par département */}
              <ChartWrapper title="Répartition par département">
                {Object.keys(departementsDist).length > 0 ? (
                  <Doughnut
                    data={doughnutDeptData}
                    options={{
                      responsive: true,
                      plugins: { legend: { position: 'bottom' } }
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">Pas de données de département</p>
                )}
              </ChartWrapper>

              {/* Heures d'absences du mois */}
              <ChartWrapper title="Heures d'absences ce mois (total)">
                {absentHoursForMonth > 0 ? (
                  <Bar
                    data={{
                      labels: [MONTH_LABELS[new Date().getMonth()]],
                      datasets: [{
                        label: 'Heures d\'absence',
                        data: [absentHoursForMonth],
                        backgroundColor: ['#EF4444']
                      }]
                    }}
                    options={{
                      responsive: true,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: {
                          title: { display: true, text: 'Heures' },
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">Aucune absence ce mois</p>
                )}
              </ChartWrapper>
            </div>

            {/*------------ Troisième ligne : nouvelles analyses ------------*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Distribution des nouvelles recrues (mois/année) */}
              <ChartWrapper title="Distribution des nouvelles recrues">
                {hireDistribution.some(v => v > 0) ? (
                  <Bar
                    data={barHireData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: {
                          display: false
                        }
                      },
                      scales: {
                        x: { title: { display: true, text: 'Mois' } },
                        y: { title: { display: true, text: 'Recrues' }, beginAtZero: true }
                      }
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">Aucune recrue cette année</p>
                )}
              </ChartWrapper>

              {/* Taux d'absentéisme par département */}
              <ChartWrapper title="Taux d'absentéisme par département (%)">
                {Object.keys(absentByDept).length > 0 ? (
                  <Bar
                    data={barAbsentDeptData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        x: { title: { display: true, text: 'Département' } },
                        y: { title: { display: true, text: 'Taux (%)' }, beginAtZero: true }
                      }
                    }}
                  />
                ) : (
                  <p className="text-center text-gray-500">Pas de données d’absentéisme par département</p>
                )}
              </ChartWrapper>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}


// Composant “Card” réutilisable pour les compteurs en haut
function Card({ title, count, icon, color }) {
  const base = {
    blue:   'border-blue-200 hover:border-blue-400',
    green:  'border-green-200 hover:border-green-400',
    yellow: 'border-yellow-200 hover:border-yellow-400',
    red:    'border-red-200 hover:border-red-400'
  }
  return (
    <div 
      className={`flex items-center space-x-4 p-6 bg-white border rounded-xl shadow-sm transition ${base[color] || ''}`}>
      <div className="p-3 bg-gray-100 rounded-full">
        {icon}
      </div>
      <div>
        <h2 className="text-lg font-medium text-gray-700">{title}</h2>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  )
}

// Composant “ChartWrapper” pour encadrer chaque graphique
function ChartWrapper({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}
