import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import GroupCard from "../components/GroupCard";

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchGroups() {
    try {
      setLoading(true);
      const response = await API.get("/groups/");
      setGroups(response.data);
    } catch (err) {
      setError("Impossible de charger les tontines.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <div>
      <Navbar />

      <main className="p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Mes tontines</h2>

          <Link
            to="/groups/create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Nouvelle tontine
          </Link>
        </div>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && groups.length === 0 && (
          <p className="bg-white p-4 rounded-xl shadow">
            Aucune tontine pour le moment. Créez-en une.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
