// src/pages/IndexEmp.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavbarEmp from '../components/layout/NavbarEmp';
import Footer from '../components/layout/Footer';
import {
  Calendar,
  ClipboardCheck,
  MessageSquare,
  Briefcase,
  Bell,
  PieChart,
  UserCheck,
  FileText,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Liste des modules RH (inchangée)
const hrModules = [
  { name: 'Recrutement', icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
  { name: 'Planning & Congés', icon: Calendar, color: 'bg-green-100 text-green-600' },
  { name: 'Demandes de congés', icon: ClipboardCheck, color: 'bg-blue-100 text-blue-600' },
  { name: 'Messagerie interne', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  { name: 'Annonces & Notifications', icon: Bell, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Performance', icon: PieChart, color: 'bg-red-100 text-red-600' },
  { name: 'Gestion des profils', icon: UserCheck, color: 'bg-teal-100 text-teal-600' },
  { name: 'Rapports RH', icon: FileText, color: 'bg-pink-100 text-pink-600' },
];

export default function IndexEmp() {
  // Statistiques fictives pour le Hero (employés, congés, recrutements)
  const [stats, setStats] = useState({
    prestataires: 0,
    clients: 0,
    services: 0,
  });

  // Tableau des annonces
  const [annonces, setAnnonces] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    // 1) Récupération des stats pour les cartes du Hero
    const fetchStats = async () => {
      try {
        const [usersRes, servicesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/users'),
          axios.get('http://localhost:8000/api/services'),
        ]);

        const users = usersRes.data;
        const services = servicesRes.data;

        const prestatairesCount = users.filter((u) => u.role === 'prestataire').length;
        const clientsCount = users.filter((u) => u.role === 'client').length;
        const servicesCount = services.length;

        setStats({
          prestataires: prestatairesCount,
          clients: clientsCount,
          services: servicesCount,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des stats :', error);
      }
    };

    // 2) Récupération des annonces
    const fetchAnnonces = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/annonces');
        setAnnonces(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des annonces :', err);
      }
    };

    fetchStats();
    fetchAnnonces();
  }, []);

  return (
    <div className="min-h-screen pt-16 flex flex-col bg-gray-50">
      <NavbarEmp />

      <main className="flex-grow relative">
        {/* ======================================================================= */}
        {/*                          SECTION “HERO” / ACCUEIL                       */}
        {/* ======================================================================= */}
        <section className="relative bg-brand-blue min-h-[60vh] flex items-center justify-center overflow-hidden">
          {/* 1) Image de fond */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
            style={{
              backgroundImage:
                "url('https://i0.wp.com/www.sutisoft.com/blog/wp-content/uploads/2015/04/HR-Management-Systems-scaled.jpeg?fit=1024%2C576&ssl=1')",
              backgroundBlendMode: 'overlay',
            }}
          />
          {/* 2) Overlay bleu semi-transparent */}
          <div className="absolute inset-0 bg-brand-blue bg-opacity-75 z-10"></div>

          {/* 3) Contenu centré */}
          <div className="container mx-auto px-4 relative z-20 text-center">
            <div className="max-w-3xl mx-auto">
              {/* Titre de bienvenue */}
              <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 text-shadow animate-fade-up">
                Bienvenue dans votre espace Employé
              </h1>

              {/* Paragraphe expliquant uniquement les 4 onglets */}
              <p
                className="text-white text-lg md:text-xl mb-8 animate-fade-up"
                style={{ animationDelay: '0.1s' }}
              >
                Depuis la barre de navigation, vous pouvez :
              </p>
              <ul
                className="list-disc list-inside text-white space-y-2 mb-12 ml-6 text-left animate-fade-up"
                style={{ animationDelay: '0.2s' }}
              >
                <li>
                  <strong>Accueil</strong> : revenir à cette page pour un aperçu rapide.
                </li>
                <li>
                  <strong>Mes Demandes d’avances</strong> : créer et suivre vos demandes
                  d’avances financières.
                </li>
                <li>
                  <strong>Mes Demandes Congés</strong> : déposer, suivre le statut et
                  visualiser l’historique de vos congés.
                </li>
                <li>
                  <strong>Messageries</strong> : échanger directement avec vos collègues et
                  l’administration.
                </li>
              </ul>

            </div>
          </div>

        </section>

        {/* ======================================================================= */}
        {/*                        SECTION “ANNONCES RÉCENTES”                      */}
        {/* ======================================================================= */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-brand-blue mb-6 animate-fade-up">
              Annonces récentes
            </h2>
            {annonces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {annonces.map((annonce) => (
                  <div
                    key={annonce.id}
                    className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 animate-fade-up"
                  >
                    <h3 className="text-xl font-semibold text-brand-blue mb-2">
                      {annonce.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {annonce.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      Publié le{' '}
                      <span className="font-medium">
                        {new Date(annonce.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic animate-fade-up">
                Aucune annonce disponible.
              </p>
            )}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
