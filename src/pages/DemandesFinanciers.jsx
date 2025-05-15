// src/pages/NotFound.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import {
  ArrowLeft,
  User,
  Wallet,
  Star,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Calendar,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import axios from 'axios';

const types = [
  { label: 'Tous',   value: ''        },
  { label: 'Avance', value: 'avance'  },
  { label: 'Prime',  value: 'prime'   }
];
const statuses = [
  { label: 'Tous',        value: ''           },
  { label: 'En attente',  value: 'en_attente' },
  { label: 'Approuvé',    value: 'acceptee'   },
  { label: 'Refusé',      value: 'refusee'    }
];

// Backup statique si l’API tombe en rade
const mockDemandes = [
  {
    id: 1,
    user:       { nom: 'Alice', prenom: 'Durand' },
    type:       'avance',
    montant:    500,
    motif:      'Achat urgente de matériel',
    created_at: '2025-05-10',
    etat:       'en_attente'
  },
  {
    id: 2,
    user:       { nom: 'Bob', prenom: 'Martin' },
    type:       'prime',
    montant:    1200,
    motif:      'Performance du trimestre',
    created_at: '2025-05-01',
    etat:       'acceptee'
  }
];

const DemandesFinanciers = () => {
  const [demandes,     setDemandes]     = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading,      setLoading]      = useState(true);
  const [showDetail,   setShowDetail]   = useState(false);
  const [detailDemande, setDetailDemande] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // 1️⃣ Fetch & normalisation
  useEffect(() => {
    setLoading(true);
    axios.get(`${baseUrl}/api/demandes_financieres`)
      .then(({ data }) => {
        const mapped = data.map(d => ({
          ...d,
          employee: { nom: d.enseignant.nom, prenom: d.enseignant.prenom },
          amount:   d.montant,
          reason:   d.motif,
          date:     d.created_at,
          statut:   d.etat
        }));
        setDemandes(mapped);
        setFiltered(mapped);
      })
      .catch(() => {
        // fallback statique
        const mapped = mockDemandes.map(d => ({
          ...d,
          employee: d.user,
          amount:   d.montant,
          reason:   d.motif,
          date:     d.created_at,
          statut:   d.etat
        }));
        setDemandes(mapped);
        setFiltered(mapped);
      })
      .finally(() => setLoading(false));
  }, []);

  // 2️⃣ Recherche & filtres
  useEffect(() => {
    let tmp = [...demandes];
    if (search) {
      const q = search.toLowerCase();
      tmp = tmp.filter(d =>
        `${d.employee.nom} ${d.employee.prenom}`.toLowerCase().includes(q) ||
        d.reason.toLowerCase().includes(q)
      );
    }
    if (typeFilter)   tmp = tmp.filter(d => d.type   === typeFilter);
    if (statusFilter) tmp = tmp.filter(d => d.statut === statusFilter);
    setFiltered(tmp);
  }, [search, typeFilter, statusFilter, demandes]);

  // 3️⃣ Mettre à jour le statut
  const changeStatut = (id, newStatut) => {
    axios.patch(`${baseUrl}/api/demandes_financieres/${id}`, { etat: newStatut })
      .then(({ data }) => {
        setDemandes(ds =>
          ds.map(d => d.id === id ? { ...d, statut: data.etat } : d)
        );
      });
  };

  // 4️⃣ Supprimer
  const deleteDemande = id => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    axios.delete(`${baseUrl}/api/demandes_financieres/${id}`)
      .then(() => {
        setDemandes(ds => ds.filter(d => d.id !== id));
      });
  };

  // 5️⃣ Ouvrir modal détail
  const viewDetail = d => {
    setDetailDemande(d);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">

          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Link to="/" className="inline-flex items-center text-brand-blue hover:text-brand-darkBlue">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour tableau RH
              </Link>
              <h1 className="mt-2 text-3xl font-bold text-brand-blue">
                Demandes d'Avance & de Prime
              </h1>
            </div>
            <div className="relative w-1/3">
              <input
                type="text"
                placeholder="Rechercher employé ou raison..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-6">

            <aside className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Type</h4>
                  {types.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setTypeFilter(t.value)}
                      className={cn(
                        'w-full text-left py-2 px-3 rounded-lg transition',
                        t.value === typeFilter
                          ? 'bg-brand-lightBlue bg-opacity-30 text-brand-blue'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">Statut</h4>
                  {statuses.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setStatusFilter(s.value)}
                      className={cn(
                        'w-full text-left py-2 px-3 rounded-lg transition',
                        s.value === statusFilter
                          ? 'bg-brand-lightBlue bg-opacity-30 text-brand-blue'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <section className="flex-grow">
              {loading ? (
                <div className="bg-white rounded-xl p-10 text-center shadow">
                  Chargement...
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl p-10 text-center shadow">
                  <p className="text-gray-500">Aucune demande ne correspond aux filtres.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map(d => {
                    const isFinal = d.statut !== 'en_attente';
                    return (
                      <div key={d.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                        <div className="p-4 flex-grow">
                          <h3 className="font-semibold text-xl text-brand-blue">
                            {d.employee.nom} {d.employee.prenom}
                          </h3>
                          <p className="flex items-center text-gray-600 mt-2">
                            {d.type === 'avance'
                              ? <Wallet className="w-4 h-4 mr-1" />
                              : <Star   className="w-4 h-4 mr-1" />}
                            {d.type === 'avance' ? 'Avance' : 'Prime'}: {d.amount} TND
                          </p>
                          <p className="text-gray-600 mt-1">
                            <Calendar className="w-4 h-4 inline-block mr-1" />{d.date}
                          </p>
                          <p className="mt-2 text-gray-700">{d.reason}</p>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                          {/* Bouton œil */}
                          <button
                            onClick={() => viewDetail(d)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Eye className="w-5 h-5"/>
                          </button>
                          <span
                            className={cn(
                              'inline-block px-3 py-1 rounded-full text-sm font-medium',
                              d.statut === 'en_attente'
                                ? 'bg-yellow-100 text-yellow-800'
                                : d.statut === 'acceptee'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            )}
                          >
                            {statuses.find(s => s.value === d.statut)?.label}
                          </span>
                        </div>
                        <div className="p-4 border-t border-gray-100 space-y-2">
                          <div className="flex justify-between">
                            <button
                              onClick={() => changeStatut(d.id, 'acceptee')}
                              disabled={isFinal}
                              className={cn(
                                'flex items-center gap-1',
                                isFinal
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-green-600 hover:underline'
                              )}
                            >
                              <CheckCircle className="w-5 h-5" /> Approuver
                            </button>
                            <button
                              onClick={() => changeStatut(d.id, 'refusee')}
                              disabled={isFinal}
                              className={cn(
                                'flex items-center gap-1',
                                isFinal
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-red-600 hover:underline'
                              )}
                            >
                              <XCircle className="w-5 h-5" /> Refuser
                            </button>
                          </div>
                          <div className="flex justify-between">
                            <button
                              onClick={() => changeStatut(d.id, 'en_attente')}
                              disabled={isFinal}
                              className={cn(
                                'flex items-center gap-1',
                                isFinal
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'text-yellow-600 hover:underline'
                              )}
                            >
                              {/* <RefreshCcw className="w-5 h-5" /> Remettre en attente
                            </button>
                            <button
                              onClick={() => deleteDemande(d.id)}
                              className="flex items-center gap-1 text-gray-600 hover:underline"
                            >
                              <XCircle className="w-5 h-5" /> Supprimer */}
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />

      {/* Modal Détail */}
      {showDetail && detailDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">
              Détails de la demande de {detailDemande.employee.prenom} {detailDemande.employee.nom}
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="font-medium w-1/3">Type:</dt>
                <dd className="flex-1">{detailDemande.type}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">Montant:</dt>
                <dd className="flex-1">{detailDemande.amount} TND</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">Motif:</dt>
                <dd className="flex-1">{detailDemande.reason}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">Date:</dt>
                <dd className="flex-1">{detailDemande.date}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">État:</dt>
                <dd className="flex-1">{statuses.find(s => s.value === detailDemande.statut)?.label}</dd>
              </div>
            </dl>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetail(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemandesFinanciers;
