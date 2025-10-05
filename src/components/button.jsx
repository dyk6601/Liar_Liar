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
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    outline: 'border-2 border-purple-500 text-purple-500 hover:bg-purple-50'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;