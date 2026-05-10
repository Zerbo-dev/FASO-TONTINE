import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center p-4">
      <h1 className="text-9xl font-black text-indigo-200">404</h1>
      <p className="text-2xl font-bold text-slate-800 mt-4 text-center">Oups ! Cette page n'existe pas.</p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-700 transition"
      >
        Retour au Dashboard
      </button>
    </div>
  );
}

export default NotFound;