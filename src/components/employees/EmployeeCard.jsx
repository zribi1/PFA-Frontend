// src/components/employees/EmployeeCard.jsx
import React, { useEffect, useState } from 'react'
import { Edit2, Trash2, Eye, FileBarChart2 } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import axios from 'axios'

export default function EmployeeCard({ emp, onView, onEdit, onDelete }) {
    const [conges, setConges] = useState([])
    const [avances, setAvances] = useState([])

    const formatDate = dateStr => {
        try {
            return format(parseISO(dateStr), 'yyyy-MM-dd')
        } catch {
            return dateStr
        }
    }

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [resConges, resAvances] = await Promise.all([
                    axios.get(`http://localhost:8000/api/conges/enseignant/${emp.id}`),
                    axios.get(`http://localhost:8000/api/demandes_financiers/enseignants/${emp.email}`)
                ])
                setConges(resConges.data)
                setAvances(resAvances.data)
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err)
            }
        }

        if (emp?.id && emp?.email) fetchDetails()
    }, [emp])

    const groupByMonth = (items, getValue) => {
        const result = {}
        items?.forEach(item => {
            const month = format(parseISO(item.created_at), 'MMMM', { locale: fr })
            result[month] = (result[month] || 0) + getValue(item)
        })
        return result
    }

    const generateFullExcelReport = () => {
        const months = [
            'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
        ]

        const congesSheet = (conges || []).map(c => ({
            'Date début': c.date_debut || '-',
            'Date fin': c.date_fin || '-',
            'Motif': c.motif || '-',
            'État': c.etat || '-',
            'Nombre de jours': c.nbr_jours_conge || 0,
            'Créé le': formatDate(c.created_at)
        }))

        const avancesSheet = (avances || []).map(a => ({
            'Type': a.type || 'avance',
            'Montant (DT)': a.montant || 0,
            'Motif': a.motif || '-',
            'État': a.etat || '-',
            'Créé le': formatDate(a.created_at)
        }))

        const congesByMonth = groupByMonth(
            (conges || []).filter(c => ['accepté', 'validé'].includes((c.etat || '').toLowerCase())),
            c => c.nbr_jours_conge || 0
        )
        const avancesByMonth = groupByMonth(avances || [], a => a.montant || 0)

        const resumeSheet = months.map(m => ({
            'Mois': m.charAt(0).toUpperCase() + m.slice(1),
            'Total jours de congé': congesByMonth[m] || 0,
            'Total avances/primes (DT)': avancesByMonth[m] || 0
        }))

        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(congesSheet), 'Congés')
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(avancesSheet), 'Avances & Primes')
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumeSheet), 'Résumé Mensuel')

        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        saveAs(blob, `rapport_complet_${emp.nom}_${emp.prenom}.xlsx`)
    }

    if (!emp) return null

    return (
        <div className="relative bg-white rounded-xl shadow overflow-hidden flex flex-col">
            <button
                onClick={generateFullExcelReport}
                title="Exporter rapport complet"
                className="absolute top-2 right-2 text-indigo-600 hover:text-indigo-800"
            >
                <FileBarChart2 className="w-5 h-5" />
            </button>

            <div className="p-4 flex-grow">
                <h3 className="font-semibold text-xl text-brand-blue">{emp.name || 'Sans nom'}</h3>
                <p className="text-gray-600 mt-1">{emp.position || 'Sans poste'}</p>
                <div className="mt-3 text-sm space-y-1">
                    <div><span className="font-medium">Domaine:</span> {emp.department || '-'}</div>
                    <div><span className="font-medium">Tél:</span> {emp.phone || '-'}</div>
                    <div><span className="font-medium">Ville:</span> {emp.location || '-'}</div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex space-x-3">
                    <button onClick={() => onView(emp)} className="text-gray-600 hover:text-gray-800">
                        <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={() => onEdit(emp)} className="flex items-center gap-1 text-blue-600 hover:underline">
                        <Edit2 className="w-5 h-5" /> Modifier
                    </button>
                </div>
                <button onClick={() => onDelete(emp.id)} className="flex items-center gap-1 text-red-600 hover:underline">
                    <Trash2 className="w-5 h-5" /> Supprimer
                </button>
            </div>
        </div>
    )
}
