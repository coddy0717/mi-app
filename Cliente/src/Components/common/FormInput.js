import React, { useEffect, useState } from "react";

const FormInput = ({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (type === "date" && !value) {
      const today = new Date().toISOString().split("T")[0];
      setInputValue(today);
      onChange({ target: { name, value: today } });
    }
  }, [type, value, name, onChange]);

  return (
    <div>
      <label htmlFor={id} className="text-blue-900">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e);
        }}
        className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
        required={required}
      />
    </div>
  );
};

export default FormInput;
