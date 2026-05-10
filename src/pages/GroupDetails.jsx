import Navbar from '../components/Navbar';

function GroupDetails() {
  // Données fictives pour la démonstration
  const members = [
    { id: 1, name: "Arouna Koné", status: "Payé", date: "10/05/2026", cnib: "B14529871", amount: "5.000" },
    { id: 2, name: "Faiza Sawadogo", status: "En attente", date: "-", cnib: "B11002233", amount: "5.000" },
    { id: 3, name: "Oumarou Diallo", status: "Payé", date: "08/05/2026", cnib: "B09988776", amount: "5.000" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Détails du Groupe</h2>
          <p className="text-slate-500 text-lg">Tontine : <span className="font-semibold text-indigo-600">Amis ISGE (Mensuel)</span></p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Membre</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CNIB</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Montant</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date de paiement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-slate-800 font-bold">{m.name}</td>
                  <td className="p-4 text-slate-500 font-mono text-sm">{m.cnib}</td>
                  <td className="p-4 text-slate-700 font-medium">{m.amount} FCFA</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      m.status === 'Payé' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-sm">{m.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default GroupDetails;