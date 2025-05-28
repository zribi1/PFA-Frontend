import React, { useState, useEffect } from 'react';
import NavbarEmp from '../components/layout/NavbarEmp';
import Footer from '../components/layout/Footer';
import { User, Wallet, Star, Calendar, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

const statuses = [
  { label: 'Tous', value: '' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Approuvé', value: 'acceptee' },
  { label: 'Refusé', value: 'refusee' }
];

const MyDemandesFinanciers = () => {
  const [demandes, setDemandes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [detailDemande, setDetailDemande] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    axios.get(`${baseUrl}/api/demandes_financiers/enseignants/${user.email}`)
      .then(({ data }) => {
        const mapped = data.map(d => ({
          ...d,
          amount: d.montant,
          reason: d.motif,
          date: d.created_at,
          statut: d.etat
        }));
        setDemandes(mapped);
        setFiltered(mapped);
      })
      .catch(err => {
        console.error("Erreur lors du chargement des demandes :", err);
        setDemandes([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let tmp = [...demandes];
    if (search) {
      const q = search.toLowerCase();
      tmp = tmp.filter(d =>
        d.reason.toLowerCase().includes(q)
      );
    }
    if (statusFilter) tmp = tmp.filter(d => d.statut === statusFilter);
    setFiltered(tmp);
  }, [search, statusFilter, demandes]);

  const viewDetail = d => {
    setDetailDemande(d);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarEmp />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-brand-blue">Mes Demandes Financières</h1>
            <div className="relative w-full md:w-1/3 mt-4">
              <input
                type="text"
                placeholder="Rechercher par motif..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            {statuses.map(s => (
              <button
                key={s.value}
                onClick={() => setStatusFilter(s.value)}
                className={cn(
                  'px-4 py-2 rounded-full border text-sm',
                  statusFilter === s.value
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-10 text-center shadow">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow">
              <p className="text-gray-500">Aucune demande trouvée.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(d => (
                <div key={d.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
                  <div className="p-4 flex-grow">
                    <h3 className="font-semibold text-xl text-brand-blue capitalize">
                      {d.type === 'avance' ? 'Avance' : 'Prime'} - {d.amount} TND
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 inline-block mr-1" /> {d.date}
                    </p>
                    <p className="mt-2 text-gray-700">{d.reason}</p>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <button onClick={() => viewDetail(d)} className="text-gray-600 hover:text-gray-800">
                      <Eye className="w-5 h-5" />
                    </button>
                    <span className={cn(
                      'inline-block px-3 py-1 rounded-full text-sm font-medium',
                      d.statut === 'en_attente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : d.statut === 'acceptee'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    )}>
                      {statuses.find(s => s.value === d.statut)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {showDetail && detailDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Détails de la demande</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="font-medium w-1/3">Type:</dt>
                <dd className="flex-1 capitalize">{detailDemande.type}</dd>
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
              <button onClick={() => setShowDetail(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDemandesFinanciers;
