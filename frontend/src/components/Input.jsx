function Input({ label, type = "text", value, onChange, placeholder, min }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default Input;