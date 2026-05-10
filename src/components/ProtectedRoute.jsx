import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // On regarde si l'utilisateur existe dans le stockage du navigateur
  const user = JSON.parse(localStorage.getItem("user"));

  // Si pas d'utilisateur, on redirige vers la page de connexion (/)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Sinon, on affiche la page demandée
  return children;
}

export default ProtectedRoute;