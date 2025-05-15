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
          employee: { nom: d.user.nom, prenom: d.user.prenom },
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

            </div>
            <div className="relative w-1/3">

            </div>
          </div>

          {/* Sidebar + Grid */}
          <div className="flex flex-col lg:flex-row gap-6">

            Not found


          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DemandesFinanciers;
