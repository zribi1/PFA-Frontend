// HRDashboardSection.jsx
import React from 'react'
import {
  Briefcase,
  Calendar,
  ClipboardCheck,
  MessageSquare,
  Bell,
  PieChart,
  UserCheck,
  FileText
} from 'lucide-react'
import { cn } from '@/lib/utils'

const hrModules = [
  {
    name: 'Recrutement',
    icon: Briefcase,
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    name: 'Planning & Congés',
    icon: Calendar,
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'Demandes de congés',
    icon: ClipboardCheck,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'Messagerie interne',
    icon: MessageSquare,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'Annonces & Notifications',
    icon: Bell,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    name: 'Performance',
    icon: PieChart,
    color: 'bg-red-100 text-red-600'
  },
  {
    name: 'Gestion des profils',
    icon: UserCheck,
    color: 'bg-teal-100 text-teal-600'
  },
  {
    name: 'Rapports RH',
    icon: FileText,
    color: 'bg-pink-100 text-pink-600'
  }
]

const ModuleCard = ({ module, index }) => (
  <div
    className="glass-card p-6 rounded-xl flex flex-col items-center text-center hover-lift cursor-pointer animate-fade-up"
    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
  >
    <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-4", module.color)}>
      <module.icon className="w-8 h-8" />
    </div>
    <h3 className="font-semibold text-brand-blue">{module.name}</h3>
  </div>
)

const HRDashboardSection = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-brand-blue mb-4 animate-fade-up">
          Espace RH
        </h2>
        <p
          className="text-gray-600 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          Accédez rapidement aux principaux outils et modules de gestion
          des ressources humaines.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {hrModules.map((mod, idx) => (
          <ModuleCard key={mod.name} module={mod} index={idx} />
        ))}
      </div>

      <div
        className="text-center mt-12 animate-fade-up"
        style={{ animationDelay: '0.5s' }}
      >
        <button className="btn-primary">Voir tous les modules</button>
      </div>
    </div>
  </section>
)

export default HRDashboardSection
