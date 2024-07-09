import React from "react";

const FormTextArea = ({
  id,
  label,
  name,
  value,
  onChange,
  required = true,
}) => (
  <div>
    <label htmlFor={id} className="text-blue-900">
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
      required={required}
    ></textarea>
  </div>
);

export default FormTextArea;
