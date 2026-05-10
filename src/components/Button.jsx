export default function Button({ children, onClick, type = "button" }) {
  return (
    <button 
      type={type} onClick={onClick}
      className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-700 transition"
    >
      {children}
    </button>
  );
}