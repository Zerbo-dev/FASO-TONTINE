import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf5' }}>
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Tableau de bord
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full border border-green-200 uppercase font-bold">Vérifié</span>
            </h2>
            <p className="text-slate-600 mt-2">Bienvenue sur votre espace d'épargne communautaire.</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/create-group')} className="bg-white text-orange-600 border-2 border-orange-100 px-6 py-3 rounded-2xl font-bold hover:bg-orange-50 transition shadow-sm">+ Créer</button>
            <button onClick={() => navigate('/payments')} className="bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-100">Verser</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
            <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Épargne Totale</span>
            <p className="text-4xl font-black text-slate-900 mt-3">125 000 <span className="text-sm font-normal text-slate-400 italic">FCFA</span></p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
            <span className="text-xs font-black text-green-500 uppercase tracking-widest">Tontines Actives</span>
            <p className="text-4xl font-black text-slate-900 mt-3">02</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-orange-50">
            <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Prochain Tour</span>
            <p className="text-4xl font-black text-slate-900 mt-3">25 Mai</p>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-sm overflow-hidden">
          <div className="p-8 flex items-center justify-between hover:bg-orange-50/30 transition">
            <div>
              <p className="font-black text-slate-800 text-xl">Tontine Promotion ISGE 2026</p>
              <p className="text-slate-500 font-medium">Cotisation : 10.000 FCFA / Mensuel</p>
            </div>
            <button onClick={() => navigate('/group-details')} className="bg-orange-50 text-orange-600 px-6 py-2.5 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all">Voir détails</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;