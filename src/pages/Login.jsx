import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdfaf5' }}>
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl w-full max-w-md border border-orange-100 text-center">
        <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
          <span className="text-white text-3xl">🐚</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">FasoTontine</h2>
        <p className="text-slate-500 mb-8 font-medium">L'épargne solidaire du Burkina</p>
        
        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-4">
          <input type="text" placeholder="Numéro de téléphone" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition" required />
          <input type="password" placeholder="Mot de passe" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition" required />
          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all mt-4">
            Se connecter
          </button>
        </form>
        
        <p className="mt-8 text-sm text-slate-500">
          Nouveau ici ? <button onClick={() => navigate('/register')} className="text-orange-600 font-bold hover:underline">Créer un compte</button>
        </p>
      </div>
    </div>
  );
}

export default Login;