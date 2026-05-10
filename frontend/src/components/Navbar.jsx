import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="bg-white shadow px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
      <h1 className="text-xl font-bold text-green-700">
        FasoTontine
      </h1>

      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
          Dashboard
        </Link>

        <Link to="/groups/create" className="text-gray-700 hover:text-green-600">
          Créer tontine
        </Link>

        <Link to="/projects" className="text-gray-700 hover:text-green-600">
          Projets
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-gray-600">
            {user.full_name}
          </span>
        )}

        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700"
        >
          Se déconnecter
        </button>
      </div>
    </nav>
  );
}

export default Navbar;