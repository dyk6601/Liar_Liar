import React from 'react';
import { XIcon } from './icons.jsx';

// components/Modal.jsx
// Lightweight modal used across the app. This component provides a simple
// centered overlay and content container. It intentionally keeps styling
// conservative so pages can opt into Tailwind classes or fallback CSS.
// Props:
//  - isOpen: boolean
//  - onClose: () => void
//  - title: string (optional)
//  - showClose: boolean (optional)
//  - children: modal content
const Modal = ({ isOpen, onClose, children, title, showClose = true }) => {
  if (!isOpen) return null;
  
  return (
    <div className="ll-modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="ll-modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="ll-modal-header p-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {showClose && (
            <button onClick={onClose} className="ll-close-button text-gray-400 hover:text-gray-600 transition">
              <XIcon />
            </button>
          )}
        </div>
        <div className="ll-modal-body p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
export default Modal;