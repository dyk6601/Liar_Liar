// src/components/QRCode.jsx
// Fixed version using qrcode.react library
import React from 'react';

const QRCodeComponent = ({ roomCode }) => {
  const gameLink = `${window.location.origin}?room=${roomCode}`;
  
  // Option 1: Use a working QR code service with proper CORS
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(gameLink)}`;
  
  return (
    <div className="bg-gray-100 rounded-xl p-6 mb-6 flex flex-col items-center justify-center">
      <p className="text-sm text-gray-600 mb-3">Scan to Join</p>
      <div className="bg-white p-4 rounded-lg border-4 border-gray-300">
        <img 
          src={qrCodeUrl} 
          alt="QR Code to join game"
          className="w-48 h-48"
          onError={(e) => {
            // Fallback if QR code fails
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<p class="text-gray-400 w-48 h-48 flex items-center justify-center text-center">QR Code<br/>Unavailable</p>';
          }}
        />
      </div>
    </div>
  );
};

export default QRCodeComponent;