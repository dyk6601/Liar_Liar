// components/QRCodePlaceholder.jsx
import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons.jsx';

// components/QRcode.jsx
// Generates a QR image (via Google Charts API) for the room join URL.
// Notes:
//  - The QR image is a simple convenience for demos and uses a public
//    image endpoint. For production, consider server-side generation or
//    an SVG generator to avoid third-party dependencies.
const QRCode = ({ code, size = 200 }) => {
  const [copied, setCopied] = useState(false);

  if (!code) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 mb-6 flex items-center justify-center">
        <div className="w-48 h-48 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
          <p className="text-gray-400 text-center">QR Code<br/>Will appear here</p>
        </div>
      </div>
    );
  }

  const joinUrl = `${window.location.origin}/?room=${encodeURIComponent(code)}`;
  const qrSrc = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(joinUrl)}&chld=L|1`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="mb-6 flex flex-col items-center gap-3">
      <img src={qrSrc} alt={`Join room ${code}`} width={size} height={size} className="bg-white p-1 rounded-lg border" />
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600 break-all">{joinUrl}</p>
        <button onClick={handleCopy} className="text-purple-600 hover:text-purple-800 transition p-2 rounded">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};

export default QRCode;
