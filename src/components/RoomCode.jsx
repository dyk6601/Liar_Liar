// components/RoomCode.jsx
import React from 'react';
import { CheckIcon, CopyIcon } from './icons.jsx';

// components/RoomCode.jsx
// Small presentational block to display the room code and provide a copy
// affordance. Keep this purely presentational; copy logic should be handled
// by the parent (for easier testing).
const RoomCode = ({ code, onCopy, copied }) => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
      <p className="text-sm text-gray-600 mb-2 text-center">Room Code</p>
      <div className="flex items-center justify-center gap-3">
        <p className="text-4xl font-bold text-purple-600 tracking-widest">{code}</p>
        <button onClick={onCopy} className="text-purple-600 hover:text-purple-700 transition">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};
export default RoomCode;