import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Input from "../components/Input";

function GroupDetails() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [memberId, setMemberId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchGroupDetails() {
    try {
      const response = await API.get(`/groups/${id}`);
      setGroup(response.data);
    } catch (err) {
      setError("Impossible de charger les détails de la tontine.");
    }
  }

  async function addMember(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!memberId) {
      setError("L’identifiant utilisateur est obligatoire.");
      return;
    }

    try {
      await API.post(`/groups/${id}/members`, {
        user_id: Number(memberId),
        role: "member",
      });

      setMessage("Membre ajouté avec succès.");
      setMemberId("");
      fetchGroupDetails();
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l’ajout du membre.");
    }
  }

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  if (!group && !error) {
    return <p className="p-6">Chargement...</p>;
  }

  return (
    <div>
      <Navbar />

      <main className="p-6">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {group && (
          <>
            <h2 className="text-2xl font-bold text-green-700">
              {group.name}
            </h2>

            <div className="bg-white p-6 rounded-xl shadow mt-4">
              <p>Montant : {group.amount} FCFA</p>
              <p>Fréquence : {group.frequency}</p>
              <p>Nombre de membres : {group.members?.length || 0}</p>
            </div>

            <section className="bg-white p-6 rounded-xl shadow mt-6">
              <h3 className="text-xl font-bold mb-4">Membres</h3>

              {group.members?.length === 0 && <p>Aucun membre ajouté.</p>}

              <ul className="space-y-2">
                {group.members?.map((member) => (
                  <li key={member.id} className="border p-3 rounded-lg">
                    {member.full_name} — {member.phone}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-white p-6 rounded-xl shadow mt-6">
              <h3 className="text-xl font-bold mb-4">Ajouter un membre</h3>

              <form onSubmit={addMember}>
                <Input
                  label="ID utilisateur"
                  type="number"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  placeholder="Ex : 2"
                  min="1"
                />

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Ajouter
                </button>
              </form>
            </section>

            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                to={`/groups/${id}/payments`}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Suivre les paiements
              </Link>

              <Link
                to="/projects"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Voir les projets
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default GroupDetails;