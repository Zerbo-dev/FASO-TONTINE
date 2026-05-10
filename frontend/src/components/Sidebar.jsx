import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="bg-white shadow rounded-xl p-4">
      <h2 className="font-bold text-green-700 mb-4">Menu</h2>

      <div className="flex flex-col gap-2">
        <Link to="/dashboard" className="text-gray-700 hover:text-green-600">
          Dashboard
        </Link>
        <Link to="/groups/create" className="text-gray-700 hover:text-green-600">
          Nouvelle tontine
        </Link>
        <Link to="/projects" className="text-gray-700 hover:text-green-600">
          Projets communautaires
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;