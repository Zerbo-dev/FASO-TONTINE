import { Link } from "react-router-dom";

function GroupCard({ group }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="text-xl font-bold text-green-700">
        {group.name}
      </h3>

      <p className="text-gray-600 mt-2">
        Montant : {group.amount} FCFA
      </p>

      <p className="text-gray-600">
        Fréquence : {group.frequency}
      </p>

      <Link
        to={`/groups/${group.id}`}
        className="block mt-4 text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
      >
        Voir détails
      </Link>
    </div>
  );
}

export default GroupCard;