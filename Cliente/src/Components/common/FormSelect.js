import React from "react";

const FormSelect = ({
  id,
  label,
  name,
  value,
  onChange,
  options,
  required = true,
  disabled = false,
}) => (
  <div>
    <label htmlFor={id} className="text-orange-500">
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
      required={required}
      disabled={disabled}
    >
      <option value="">Seleccione {label.toLowerCase()}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
