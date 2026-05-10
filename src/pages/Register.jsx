import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';

function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <h2 className="text-3xl font-bold text-indigo-900 mb-2 text-center">Rejoindre FasoTontine</h2>
        <p className="text-slate-500 text-center mb-8 text-sm">Sécurisez votre épargne avec votre identité</p>
        
        <form onSubmit={(e) => { e.preventDefault(); navigate('/login'); }} className="space-y-1">
          <Input label="Nom complet" placeholder="Ex: Adama Traoré" required />
          <Input label="Numéro de téléphone" placeholder="70 00 00 00" required />
          
          {/* NOUVELLE PARTIE CNIB */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
            <Input 
              label="Numéro CNIB" 
              placeholder="Ex: B12345678" 
              required 
            />
            <p className="text-[10px] text-blue-600 mt-1 italic">
              * La CNIB est obligatoire pour garantir la confiance entre les membres du groupe.
            </p>
          </div>

          <Input label="Mot de passe" type="password" placeholder="••••••••" required />
          
          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg mt-4">
            Créer mon compte
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600">Déjà inscrit ? </span>
          <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;