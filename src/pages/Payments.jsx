import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // On importe la barre de navigation

function Payments() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [tontine, setTontine] = useState('Tontine Familiale - 5000/mois');

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulation de succès
    alert(`Succès ! Votre versement de ${amount} FCFA pour "${tontine}" a été envoyé.`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Affichage de la barre de navigation en haut */}
      <Navbar />

      <div className="max-w-md mx-auto pt-10 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Faire un versement</h2>
          
          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Choisir la Tontine</label>
              <select 
                value={tontine}
                onChange={(e) => setTontine(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option>Tontine Familiale - 5000/mois</option>
                <option>Épargne Moto - 10000/mois</option>
                <option>Caisse d'Urgence - Libre</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Montant à verser (FCFA)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 5000" 
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                required 
              />
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-700 leading-relaxed">
                <strong>Note :</strong> Une fois le versement confirmé, l'administrateur de la tontine recevra une notification pour valider votre transaction.
              </p>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg active:scale-95">
              Confirmer le Paiement
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payments;