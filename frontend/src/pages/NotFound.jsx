import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-red-600">
        404
      </h1>

      <p className="mt-2">
        Page introuvable
      </p>

      <Link
        to="/dashboard"
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Retour au dashboard
      </Link>
    </div>
  );
}

export default NotFound;