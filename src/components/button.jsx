import React from 'react';

// components/Button.jsx
// Small presentational button with a `variant` map for quick styling.
// Keep logic minimal here; prefer to alter variants or pass `className` for
// one-off customizations. Variants rely on Tailwind classes.
// Props:
//  - variant: 'primary' | 'secondary' | 'success' | 'danger' | 'outline'
//  - className: string - appended to the computed class list
//  - disabled: boolean - disables interaction and applies visual state
const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const variants = {
    primary: 'bg-red-500 hover:bg-red-600 text-white shadow-lg border-4 border-gray-800',
    secondary: 'bg-amber-50 hover:bg-amber-100 text-gray-800 shadow-lg border-4 border-gray-800',
    success: 'bg-red-500 hover:bg-red-600 text-white shadow-lg border-4 border-gray-800',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg border-4 border-gray-800',
    outline: 'bg-amber-50 hover:bg-amber-100 text-gray-800 shadow-lg border-4 border-gray-800',
    blue: 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg border-4 border-gray-800'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;