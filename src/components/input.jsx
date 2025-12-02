import React from 'react';


// Minimal text input used throughout the app. It intentionally forwards
// `...rest` so callers can add aria-* attributes, maxLength, type overrides, etc.
// Props: placeholder, value, onChange, className, ...rest

const Input = ({ placeholder, value, onChange, className = '', ...rest }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 transition ${className}`}
      {...rest}
    />
  );
};
export default Input;