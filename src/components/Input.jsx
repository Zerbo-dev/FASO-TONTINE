import React from 'react';

const Input = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
      />
    </div>
  );
};

export default Input;