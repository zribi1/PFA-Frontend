import React from 'react'

export default function EmployeeFormModal({
  isOpen,
  onClose,
  onSubmit,
  form,
  setForm,
  genres,
  etatsCivils,
  typesId,
  API,
  resetForm
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 overflow-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">{form.id ? 'Modifier un employé' : 'Ajouter un nouvel employé'}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700">Prénom</label><input value={form.prenom} onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Nom</label><input value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} required className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Genre</label><select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} className="w-full border rounded px-3 py-2"><option value="">Sélectionner</option>{genres.map(g => <option key={g}>{g}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700">État civil</label><select value={form.etat_civil} onChange={e => setForm(f => ({ ...f, etat_civil: e.target.value }))} className="w-full border rounded px-3 py-2"><option value="">Sélectionner</option>{etatsCivils.map(e => <option key={e}>{e}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700">Date de naissance</label><input type="date" value={form.date_naissance} onChange={e => setForm(f => ({ ...f, date_naissance: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Lieu de naissance</label><input value={form.lieu_naissance} onChange={e => setForm(f => ({ ...f, lieu_naissance: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Nationalité</label><input value={form.nationalite} onChange={e => setForm(f => ({ ...f, nationalite: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div className="grid grid-cols-2 gap-2"><div><label className="block text-sm font-medium text-gray-700">Rue</label><input value={form.rue} onChange={e => setForm(f => ({ ...f, rue: e.target.value }))} className="w-full border rounded px-3 py-2" /></div><div><label className="block text-sm font-medium text-gray-700">Numéro</label><input value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} className="w-full border rounded px-3 py-2" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700">Ville</label><input value={form.ville} onChange={e => setForm(f => ({ ...f, ville: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Code postal</label><input type="number" value={form.code_postal} onChange={e => setForm(f => ({ ...f, code_postal: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Pays</label><input value={form.pays} onChange={e => setForm(f => ({ ...f, pays: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Type d'identité</label><select value={form.type_identite} onChange={e => setForm(f => ({ ...f, type_identite: e.target.value }))} className="w-full border rounded px-3 py-2"><option value="">Sélectionner</option>{typesId.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700">N° identité</label><input value={form.numero_identite} onChange={e => setForm(f => ({ ...f, numero_identite: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Date délivrance</label><input type="date" value={form.date_delivrance} onChange={e => setForm(f => ({ ...f, date_delivrance: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Email</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Tél GSM</label><input value={form.tel_gsm} onChange={e => setForm(f => ({ ...f, tel_gsm: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Tél fixe</label><input value={form.tel_fixe} onChange={e => setForm(f => ({ ...f, tel_fixe: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Diplôme</label><input value={form.diplome} onChange={e => setForm(f => ({ ...f, diplome: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Domaine</label><input value={form.domaine} onChange={e => setForm(f => ({ ...f, domaine: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Grade</label><input value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">Expérience académique</label><textarea value={form.experience_academique} onChange={e => setForm(f => ({ ...f, experience_academique: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">Expérience professionnelle</label><textarea value={form.experience_professionnelle} onChange={e => setForm(f => ({ ...f, experience_professionnelle: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Autre diplôme</label><input value={form.autre_diplome} onChange={e => setForm(f => ({ ...f, autre_diplome: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">CV (fichier PDF ou DOC)</label><input type="file" accept=".pdf,.doc,.docx" onChange={e => { const file = e.target.files[0]; setForm(f => ({ ...f, cv: file })) }} className="w-full border rounded px-3 py-2" />{form.cv && typeof form.cv === 'string' && (<div className="mt-1 text-sm text-gray-500">CV actuel: <a href={`${API}/storage/cv/${form.cv}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir le CV</a></div>)}</div>
            <div><label className="block text-sm font-medium text-gray-700">Situation actuelle</label><input value={form.situation_actuelle} onChange={e => setForm(f => ({ ...f, situation_actuelle: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Nombre d'heures</label><input type="number" value={form.nombre_heure} onChange={e => setForm(f => ({ ...f, nombre_heure: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div className="sm:col-span-2"><label className="block text-sm font-medium text-gray-700">Établissement d'origine</label><input value={form.etablissement_origine} onChange={e => setForm(f => ({ ...f, etablissement_origine: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Date autorisation</label><input type="date" value={form.date_autorisation} onChange={e => setForm(f => ({ ...f, date_autorisation: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Date recrutement</label><input type="date" value={form.date_recrutement} onChange={e => setForm(f => ({ ...f, date_recrutement: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">N° affiliation</label><input value={form.numero_affiliation} onChange={e => setForm(f => ({ ...f, numero_affiliation: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Catégorie</label><input value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">RIB</label><input value={form.rib} onChange={e => setForm(f => ({ ...f, rib: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Établissement</label><input value={form.etablissement} onChange={e => setForm(f => ({ ...f, etablissement: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
            <div><label className="block text-sm font-medium text-gray-700">Salaire</label><input type="number" step="0.01" value={form.salaire_fixe} onChange={e => setForm(f => ({ ...f, salaire_fixe: e.target.value }))} className="w-full border rounded px-3 py-2" /></div>
          </div>

          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-200">
            <button type="button" onClick={() => { onClose(); resetForm(); }} className="px-4 py-2 border rounded">
              Annuler
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {form.id ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
