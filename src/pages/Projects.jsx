import { useState } from 'react';
import Navbar from '../components/Navbar';

function Projects() {
  // On utilise un état (useState) pour gérer les votes localement pour la démo
  const [projectList, setProjectList] = useState([
    { 
      id: 1, 
      title: "Aide Scolaire Rentrée 2026", 
      description: "Achat de fournitures pour les enfants des membres de la tontine.", 
      fund: "500.000", 
      raised: "350.000", 
      votes: 12, 
      status: "En vote" 
    },
    { 
      id: 2, 
      title: "Investissement Micro-Solaire", 
      description: "Installation de kits solaires communautaires pour les zones rurales.", 
      fund: "2.000.000", 
      raised: "2.000.000", 
      votes: 45, 
      status: "Financé" 
    },
  ]);

  const handleVote = (id) => {
    setProjectList(projectList.map(p => 
      p.id === id ? { ...p, votes: p.votes + 1 } : p
    ));
    alert("Votre vote a été pris en compte !");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fdfaf5' }}>
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Projets Communautaires</h2>
          <p className="text-slate-600 mt-2 font-medium">Votez et participez aux projets qui comptent pour vous.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectList.map(p => (
            <div key={p.id} className="bg-white p-8 rounded-[2.5rem] border border-orange-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-800">{p.title}</h3>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    p.status === 'Financé' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
                {/* COMPTEUR DE VOTES */}
                <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                  <p className="text-xl font-black text-orange-600">{p.votes}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Votes</p>
                </div>
              </div>

              <p className="text-slate-600 mb-8 text-sm leading-relaxed">{p.description}</p>
              
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-50 mb-6">
                <div className="flex justify-between text-xs font-bold mb-3 text-slate-500">
                  <span>Objectif : {p.fund} FCFA</span>
                  <span className="text-orange-600">{p.raised} FCFA collectés</span>
                </div>
                <div className="w-full bg-orange-100/50 rounded-full h-3 shadow-inner">
                  <div 
                    className="bg-orange-500 h-3 rounded-full transition-all duration-1000" 
                    style={{width: `${(p.raised.replace(/\./g,'') / p.fund.replace(/\./g,'')) * 100}%`}}
                  ></div>
                </div>
              </div>

              {/* BOUTON DE VOTE */}
              {p.status !== 'Financé' && (
                <button 
                  onClick={() => handleVote(p.id)}
                  className="w-full bg-white border-2 border-orange-500 text-orange-600 py-3 rounded-xl font-black hover:bg-orange-500 hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span>🗳️</span> Voter pour ce projet
                </button>
              )}
              
              {p.status === 'Financé' && (
                <button className="w-full bg-slate-100 text-slate-400 py-3 rounded-xl font-black cursor-not-allowed">
                  Financement terminé
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Projects;