import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setError("");

    if (!fullName || !phone || !password) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/register", {
        full_name: fullName,
        phone,
        password,
      });

      alert("Compte créé avec succès");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Créer un compte
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

        <Input
          label="Nom complet"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Votre nom complet"
        />

        <Input
          label="Téléphone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ex : 70000000"
        />

        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Créer un mot de passe"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Création..." : "S’inscrire"}
        </Button>

        <p className="text-center mt-4 text-sm">
          Déjà un compte ? {" "}
          <Link to="/" className="text-green-600 font-semibold">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;