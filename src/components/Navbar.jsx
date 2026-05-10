import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-orange-100 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-100">
          <span className="text-white text-xl cauri-logo">🐚</span>
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tighter">
          Faso<span className="text-orange-600">Tontine</span>
        </span>
      </div>

      <div className="flex space-x-6 items-center font-bold text-sm text-slate-600">
        <button onClick={() => navigate('/dashboard')} className="hover:text-orange-600 transition">Accueil</button>
        <button onClick={() => navigate('/projects')} className="text-orange-600 bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition">Projets</button>
        <button onClick={() => navigate('/login')} className="text-slate-400 hover:text-red-500 transition font-medium">Quitter</button>
      </div>
    </nav>
  );
}

export default Navbar;