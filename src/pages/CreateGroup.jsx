import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Input from '../components/Input';

function CreateGroup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('Mensuel');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Succès : La tontine "${name}" a été créée avec une fréquence ${frequency} !`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-10 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200">
          <h2 className="text-2xl font-bold text-indigo-900 mb-6 text-center">Créer une Tontine</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Nom de la tontine" 
              placeholder="Ex: Promotion ISGE 2026" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            
            <Input 
              label="Montant de la cotisation (FCFA)" 
              type="number" 
              placeholder="Ex: 5000" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
            />
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Fréquence des tours</label>
              <select 
                value={frequency} 
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium"
              >
                <option value="Hebdomadaire">Hebdomadaire</option>
                <option value="Mensuel">Mensuel</option>
                <option value="Annuel">Annuel</option>
              </select>
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-[11px] text-indigo-700 leading-tight">
                <strong>Note :</strong> En créant ce groupe, vous devenez l'administrateur. Seuls les membres avec une <strong>CNIB valide</strong> pourront être acceptés.
              </p>
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg">
              Lancer la Tontine
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;