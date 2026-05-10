import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fonction pour mettre en surbrillance la page active
  const isActive = (path) => location.pathname === path ? "bg-red-50 text-red-600 border-r-4 border-red-600" : "text-gray-700 hover:bg-gray-50";

  return (
    <div className="w-64 min-h-screen bg-white shadow-xl flex flex-col p-4 border-r border-gray-100">
      
      {/* LOGO CAURI & TITRE */}
      <div className="flex items-center gap-3 mb-10 px-2 mt-4">
        <div className="relative w-10 h-12 bg-[#F5E6CA] rounded-[60%_60%_50%_50%] flex items-center justify-center border-2 border-[#D2B48C] shadow-sm rotate-12">
          {/* Fente du cauri */}
          <div className="w-1.5 h-6 bg-[#8B4513] rounded-full opacity-30"></div>
          {/* Reflet */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full opacity-60"></div>
        </div>
        <div>
          <h2 className="text-xl font-extrabold leading-tight">
            <span className="text-[#D21034]">Faso</span><br/>
            <span className="text-[#FF6B00]">Tontine</span>
          </h2>
        </div>
      </div>
      
      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        <Link to="/dashboard" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${isActive("/dashboard")}`}>
          <span>📊</span> Tableau de bord
        </Link>
        
        <Link to="/payments" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${isActive("/payments")}`}>
          <span>💸</span> Mes Paiements
        </Link>
        
        <Link to="/groups/create" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition ${isActive("/groups/create")}`}>
          <span>👥</span> Créer un Groupe
        </Link>
      </nav>

      {/* PIED DE LA SIDEBAR */}
      <div className="pt-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 w-full text-left text-red-600 font-bold hover:bg-red-50 rounded-lg transition"
        >
          <span>👋</span> Déconnexion
        </button>
      </div>
    </div>
  );
}