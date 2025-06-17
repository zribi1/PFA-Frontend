import React from 'react'

export default function Organigramme({ employees }) {
  return (
    <div className="mb-12 bg-white rounded-xl shadow border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Organigramme de l'entreprise</h2>
      </div>
      <div className="p-6">
        <div className="flex flex-col items-center">
          {/* Direction Générale */}
          <div className="relative mb-8">
            <div className="w-64 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <div className="font-semibold text-blue-800">DIRECTEUR</div>
              <div className="text-sm text-blue-600 mt-1">Dr. Issam Ksentini</div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-8 bg-gray-300" />
          </div>

          {/* Responsables */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[{
              title: "DIRECTEUR DES ÉTUDES TECHNOLOGIQUES",
              titleKey: "Dr. Ilhem Borcheni"
            }, {
              title: "DIRECTEUR DES ÉTUDES TIC",
              titleKey: "Dr. Said Taktak"
            }, {
              title: "DIRECTTEUR DES ÉTUDES ARCHITECTURE",
              titleKey: "Dr. Hager Bejaoui"
            }].map(({ title, titleKey }) => (
              <div key={titleKey} className="relative">
                <div className="w-56 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-center">
                  <div className="font-semibold text-indigo-800">{title}</div>
                  <div className="text-xs text-indigo-600 mt-1">{titleKey}</div>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-8 bg-gray-300" />
              </div>
            ))}
          </div>

          {/* Extraits d'équipe */}
          <div className="flex flex-wrap justify-center gap-4">
            {employees.slice(0, 8).map(emp => (
              <div key={emp.id || Math.random()} className="w-48 p-2 bg-gray-50 border border-gray-200 rounded text-center">
                <div className="font-medium text-gray-800">{emp.name?.split(' ')[0] || 'Employé'}</div>
                <div className="text-xs text-gray-500">{emp.position || 'Position'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}