import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Input from "../components/Input";
import Button from "../components/Button";

function CreateGroup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("mensuel");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreateGroup(e) {
    e.preventDefault();
    setError("");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setError("Utilisateur non connecté.");
      return;
    }

    if (!name || !amount || !frequency) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Le montant doit être supérieur à zéro.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/groups/", {
        name,
        amount: Number(amount),
        frequency,
        created_by: user.id,
      });

      alert("Tontine créée");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Navbar />

      <main className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">
          Créer une tontine
        </h2>

        <form
          onSubmit={handleCreateGroup}
          className="bg-white p-6 rounded-xl shadow"
        >
          {error && (
            <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
              {error}
            </p>
          )}

          <Input
            label="Nom de la tontine"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex : Tontine Famille"
          />

          <Input
            label="Montant de cotisation"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex : 5000"
            min="1"
          />

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Fréquence
            </label>

            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            >
              <option value="journalier">Journalier</option>
              <option value="hebdomadaire">Hebdomadaire</option>
              <option value="mensuel">Mensuel</option>
            </select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer la tontine"}
          </Button>
        </form>
      </main>
    </div>
  );
}

export default CreateGroup;