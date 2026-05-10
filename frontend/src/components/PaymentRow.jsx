function PaymentRow({ payment, onPay }) {
  return (
    <tr className="border-b">
      <td className="p-3">{payment.member_name}</td>
      <td className="p-3">{payment.amount} FCFA</td>

      <td className="p-3">
        {payment.status === "paid" ? (
          <span className="text-green-600 font-bold">Payé</span>
        ) : payment.status === "pending" ? (
          <span className="text-orange-600 font-bold">En attente</span>
        ) : (
          <span className="text-red-600 font-bold">En retard</span>
        )}
      </td>

      <td className="p-3">
        {payment.status !== "paid" && (
          <button
            onClick={() => onPay(payment.user_id)}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Marquer payé
          </button>
        )}
      </td>
    </tr>
  );
}

export default PaymentRow;