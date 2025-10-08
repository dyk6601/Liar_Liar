// components/RoomCode.jsx
import React from 'react';
import { CheckIcon, CopyIcon } from './icons.jsx';

// components/RoomCode.jsx
// Small presentational block to display the room code and provide a copy
// affordance. Keep this purely presentational; copy logic should be handled
// by the parent (for easier testing).
const RoomCode = ({ code, onCopy, copied }) => {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
      <p className="text-xs text-gray-600 mb-1 text-center">Room Code</p>
      <div className="flex items-center justify-center gap-3">
        <p className="text-3xl font-bold text-purple-600 tracking-widest">{code}</p>
        <button onClick={onCopy} className="text-purple-600 hover:text-purple-700 transition">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};
export default RoomCode;