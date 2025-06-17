import React, { useState, useEffect } from 'react';
import NavbarEmp from '../components/layout/NavbarEmp';
import Footer from '../components/layout/Footer';
import { User, Wallet, Star, Calendar, Eye, Plus, X, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

const statuses = [
  { label: 'Tous', value: '' },
  { label: 'En attente', value: 'en_attente' },
  { label: 'Approuvé', value: 'acceptee' },
  { label: 'Refusé', value: 'refusee' },
];

export default function MyDemandesFinanciers() {
  const [demandes, setDemandes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [detailDemande, setDetailDemande] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDemande, setNewDemande] = useState({
    type: 'avance',
    montant: '',
    motif: '',
  });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
  const [enseignantEmail, setEnseignantEmail] = useState(null);
  const [enseignantId, setEnseignantId] = useState(null);

  // Au montage, on récupère l'utilisateur, son email, puis son id, puis ses demandes
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('🚀 useEffect mount: current user from localStorage:', user);

    if (!user?.email) {
      console.warn('⚠️ Aucun utilisateur connecté');
      setLoading(false);
      return;
    }
    setEnseignantEmail(user.email);
    console.log('📧 Enseignant email set to:', user.email);

    // 1) Récupérer l'ID de l'enseignant à partir de son email
    axios
      .get(`${baseUrl}/enseignant`)
      .then(({ data }) => {
        console.log('✅ Retrieved enseignants list:', data);
        const ens = data.find((e) => e.email === user.email);
        if (ens) {
          setEnseignantId(ens.id);
          console.log('🔢 Enseignant ID set to:', ens.id);
        } else {
          console.warn('⚠️ Aucun enseignant trouvé pour cet email.');
        }
      })
      .catch((err) => {
        console.error('❌ Erreur lors de la récupération des enseignants :', err);
      })
      .finally(() => {
        // 2) Une fois enseignantId (ou pas), on charge les demandes
        const url = `${baseUrl}/demandes_financiers/enseignants/${encodeURIComponent(
          user.email
        )}`;
        console.log('🌐 Fetching demandes for enseignant with URL:', url);

        axios
          .get(url)
          .then(({ data }) => {
            console.log('✅ Received data for demandes:', data);
            const mapped = data.map((d) => ({
              ...d,
              amount: d.montant,
              reason: d.motif,
              date: d.created_at,
              statut: d.etat,
            }));
            console.log('🔄 Mapped demandes:', mapped);
            setDemandes(mapped);
            setFiltered(mapped);
          })
          .catch((err) => {
            console.error(
              '❌ Erreur lors du chargement des demandes pour cet enseignant :',
              err.response || err
            );
            if (err.response?.data) {
              console.error('💡 Response data:', err.response.data);
            }
            setDemandes([]);
            setFiltered([]);
          })
          .finally(() => {
            console.log('⏳ Loading state set to false');
            setLoading(false);
          });
      });
  }, []);

  // Filtrage local (search + status)
  useEffect(() => {
    console.log(
      `🔍 Filtering demandes: search="${search}", statusFilter="${statusFilter}"`
    );
    let tmp = [...demandes];
    if (search) {
      const q = search.toLowerCase();
      tmp = tmp.filter((d) => d.reason.toLowerCase().includes(q));
      console.log(`🔎 After search filter, ${tmp.length} demandes remain`);
    }
    if (statusFilter) {
      tmp = tmp.filter((d) => d.statut === statusFilter);
      console.log(`📑 After statusFilter, ${tmp.length} demandes remain`);
    }
    setFiltered(tmp);
  }, [search, statusFilter, demandes]);

  const viewDetail = (d) => {
    console.log('🔍 viewDetail called for demande:', d);
    setDetailDemande(d);
    setShowDetail(true);
  };

  const openAddModal = () => {
    console.log('🟢 openAddModal invoked');
    setNewDemande({ type: 'avance', montant: '', motif: '' });
    setShowAddModal(true);
  };

  const postDemande = async () => {
    console.log('📤 postDemande called with newDemande:', newDemande);
    if (!enseignantId) {
      console.warn('⚠️ Impossible d’envoyer : enseignantId manquant');
      return;
    }
    if (!newDemande.montant || !newDemande.motif.trim()) {
      console.warn('⚠️ Impossible d’envoyer : montant ou motif manquant');
      return;
    }

    // Ici, on envoie enseignant_id (et non created_by)
    const payload = {
      type: newDemande.type,
      montant: parseFloat(newDemande.montant),
      motif: newDemande.motif.trim(),
      enseignant_id: enseignantId,
    };
    console.log('📦 postDemande payload:', payload);

    try {
      const res = await axios.post(
        `${baseUrl}/demandes_financieres`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('✅ postDemande response status/data:', res.status, res.data);

      const d = res.data;
      const mapped = {
        ...d,
        amount: d.montant,
        reason: d.motif,
        date: d.created_at,
        statut: d.etat,
      };
      console.log('🔄 Adding new mapped demande to state:', mapped);
      setDemandes((prev) => [mapped, ...prev]);
      setShowAddModal(false);
    } catch (err) {
      console.error(
        '❌ Erreur lors de la création de la demande :',
        err.response || err
      );
      if (err.response?.data?.errors) {
        console.error('💡 Validation errors:', err.response.data.errors);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavbarEmp />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-brand-blue">
              Mes Demandes Financières
            </h1>
<button
  onClick={openAddModal}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition"
>
  <PlusCircle className="w-5 h-5" /> Nouvelle demande
</button>

          </div>

          <div className="mb-4 flex items-center gap-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Rechercher par motif..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none"
                value={search}
                onChange={(e) => {
                  console.log('🔍 search changed to:', e.target.value);
                  setSearch(e.target.value);
                }}
              />
              <User className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="flex gap-4 mb-6 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => {
                  console.log('📑 statusFilter changed to:', s.value);
                  setStatusFilter(s.value);
                }}
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
            <div className="bg-white rounded-xl p-10 text-center shadow">
              Chargement...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center shadow">
              <p className="text-gray-500">Aucune demande trouvée.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d) => (
                <div
                  key={d.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                >
                  <div className="p-4 flex-grow">
                    <h3 className="font-semibold text-xl text-brand-blue capitalize">
                      {d.type === 'avance' ? 'Avance' : 'Prime'} – {d.amount} TND
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 inline-block mr-1" />{' '}
                      {new Date(d.date).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-gray-700">{d.reason}</p>
                    {/* ➔ Affichage explicite de l’état en dessous du motif */}
                    <p className="mt-2 text-sm font-medium">
                      État:{' '}
                      <span
                        className={cn(
                          d.statut === 'en_attente'
                            ? 'text-yellow-800'
                            : d.statut === 'acceptee'
                            ? 'text-green-800'
                            : 'text-red-800'
                        )}
                      >
                        {statuses.find((s) => s.value === d.statut)?.label}
                      </span>
                    </p>
                  </div>
                  <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={() => viewDetail(d)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-5 h-5" />
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
                      {statuses.find((s) => s.value === d.statut)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Détail d'une demande */}
      {showDetail && detailDemande && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Détails de la demande</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex">
                <dt className="font-medium w-1/3">Type :</dt>
                <dd className="flex-1 capitalize">{detailDemande.type}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">Montant :</dt>
                <dd className="flex-1">{detailDemande.amount} TND</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">Motif :</dt>
                <dd className="flex-1">{detailDemande.reason}</dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">Date :</dt>
                <dd className="flex-1">
                  {new Date(detailDemande.date).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex">
                <dt className="font-medium w-1/3">État :</dt>
                <dd className="flex-1">
                  {statuses.find((s) => s.value === detailDemande.statut)?.label}
                </dd>
              </div>
            </dl>
            <div className="mt-6 text-right">
              <button
                onClick={() => {
                  console.log('❎ Closing detail modal');
                  setShowDetail(false);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour ajouter une nouvelle demande */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brand-blue">Nouvelle demande</h2>
              <button
                onClick={() => {
                  console.log('❎ Closing add modal');
                  setShowAddModal(false);
                }}
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  name="type"
                  value={newDemande.type}
                  onChange={(e) => {
                    console.log('🔄 newDemande.type changed to:', e.target.value);
                    setNewDemande((prev) => ({ ...prev, type: e.target.value }));
                  }}
                  className="w-full border p-2 rounded-lg"
                >
                  <option value="avance">Avance</option>
                  <option value="prime">Prime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Montant (TND)</label>
                <input
                  type="number"
                  name="montant"
                  value={newDemande.montant}
                  onChange={(e) => {
                    console.log('🔄 newDemande.montant changed to:', e.target.value);
                    setNewDemande((prev) => ({ ...prev, montant: e.target.value }));
                  }}
                  className="w-full border p-2 rounded-lg"
                  placeholder="Entrez le montant"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                <textarea
                  name="motif"
                  rows="3"
                  value={newDemande.motif}
                  onChange={(e) => {
                    console.log('🔄 newDemande.motif changed to:', e.target.value);
                    setNewDemande((prev) => ({ ...prev, motif: e.target.value }));
                  }}
                  className="w-full border p-2 rounded-lg"
                  placeholder="Décrivez le motif"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => {
                    console.log('❎ Cancelling new demande creation');
                    setShowAddModal(false);
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={postDemande}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
