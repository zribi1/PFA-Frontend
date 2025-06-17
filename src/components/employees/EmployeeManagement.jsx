import React from 'react'
import { ArrowLeft, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmployeeCard from '@/components/employees/EmployeeCard'

export default function EmployeeManagement({
  search,
  setSearch,
  resetForm,
  setShowForm,
  filters,
  setFilters,
  clearFilters,
  departments,
  contractTypes,
  locations,
  loading,
  filtered,
  viewDetail,
  startEdit,
  handleDelete
}) {
  return (
    <>
      {/* Barre recherche + ajouter */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
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
              onChange={e => setSearch(e.target.value)}
            />
            <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
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
                onChange={e => setFilters({ ...filters, department: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Tous</option>
                {departments.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contrat</label>
              <select
                value={filters.contract}
                onChange={e => setFilters({ ...filters, contract: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Tous</option>
                {contractTypes.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
              <select
                value={filters.location}
                onChange={e => setFilters({ ...filters, location: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">Tous</option>
                {locations.map(l => <option key={l}>{l}</option>)}
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
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow">
              <p className="text-gray-500">Aucun employé ne correspond aux critères.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(emp => (
                <EmployeeCard
                  key={emp.id || Math.random()}
                  emp={emp}
                  onView={viewDetail}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
