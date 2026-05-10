import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import PaymentRow from "../components/PaymentRow";

function Payments() {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPayments() {
    try {
      setLoading(true);
      const response = await API.get(`/payments/group/${id}`);
      setPayments(response.data);
    } catch (err) {
      setError("Impossible de charger les paiements.");
    } finally {
      setLoading(false);
    }
  }

  async function markAsPaid(userId) {
    try {
      await API.post("/payments/", {
        group_id: Number(id),
        user_id: userId,
        status: "paid",
      });

      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.error || "Erreur lors du paiement.");
    }
  }

  useEffect(() => {
    fetchPayments();
  }, [id]);

  return (
    <div>
      <Navbar />

      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6">
          Suivi des paiements
        </h2>

        {loading && <p>Chargement...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && payments.length === 0 && (
          <p className="bg-white p-4 rounded-xl shadow">
            Aucun paiement enregistré pour cette tontine.
          </p>
        )}

        {payments.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="p-3 text-left">Membre</th>
                  <th className="p-3 text-left">Montant</th>
                  <th className="p-3 text-left">Statut</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onPay={markAsPaid}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Payments;