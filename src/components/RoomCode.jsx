// components/RoomCode.jsx
import React from 'react';
import { CheckIcon, CopyIcon } from './icons.jsx';

// components/RoomCode.jsx
// Small presentational block to display the room code and provide a copy
// affordance. Keep this purely presentational; copy logic should be handled
// by the parent (for easier testing).
const RoomCode = ({ code, onCopy, copied }) => {
  return (
    <div className="bg-amber-100 rounded-2xl p-4 mb-4 shadow-lg border-4 border-gray-800">
      <p className="text-sm text-gray-800 mb-1 text-center font-bold">Room Code</p>
      <div className="flex items-center justify-center gap-3">
        <p className="text-3xl font-bold text-gray-800 tracking-widest">{code}</p>
        <button onClick={onCopy} className="text-gray-800 hover:text-red-500 transition transform hover:scale-110">
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};
export default RoomCode;