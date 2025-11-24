// src/components/QRCode.jsx
// Fixed version using qrcode.react library
import React from 'react';

const QRCodeComponent = ({ roomCode, code }) => {
  // Accept either 'roomCode' or 'code' prop
  const room = roomCode || code;
  
  if (!room) {
    console.error('❌ QRCode: No room code provided!');
    return null;
  }
  
  const baseUrl = window.location.origin + window.location.pathname;
  const gameLink = `${baseUrl}?room=${room}`;
  
  console.log('🔗 QR Code URL:', gameLink);
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(gameLink)}`;
  
  return (
    <div className="bg-amber-100 rounded-2xl p-4 mb-4 flex flex-col items-center justify-center shadow-lg border-4 border-gray-800">
      <p className="text-sm text-gray-800 mb-2 font-bold">Scan to Join</p>
      <div className="bg-white p-2 rounded-2xl border-4 border-gray-800 shadow-lg">
        <img 
          src={qrCodeUrl} 
          alt="QR Code to join game"
          className="w-32 h-32"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<p class="text-gray-800 w-32 h-32 flex items-center justify-center text-center text-xs font-bold">QR Code<br/>Unavailable</p>';
          }}
        />
      </div>
      {/* Show the URL for debugging */}
      <p className="text-xs text-gray-600 mt-2 break-all">{gameLink}</p>
    </div>
  );
};

export default QRCodeComponent;