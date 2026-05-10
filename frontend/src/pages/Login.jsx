import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import Input from "../components/Input";
import Button from "../components/Button";

function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!phone || !password) {
      setError("Téléphone et mot de passe obligatoires.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/login", {
        phone,
        password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Connexion échouée.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center text-green-700 mb-6">
          Connexion FasoTontine
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </p>
        )}

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
          placeholder="Votre mot de passe"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>

        <p className="text-center mt-4 text-sm">
          Pas encore de compte ? {" "}
          <Link to="/register" className="text-green-600 font-semibold">
            Créer un compte
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;