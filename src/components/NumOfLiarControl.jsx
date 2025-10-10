import React from 'react';

// components/NumOfLiarControl.jsx
// Presents the number-of-liars card with +/- controls.
// Props:
//  - numLiars: current number
//  - setNumLiars: setter
//  - players: array (used to bound max)
//  - isHost: whether current user can edit
const NumOfLiarControl = ({ numLiars, setNumLiars, players = [], isHost = false }) => {
  const max = Math.max(1, players.length - 1);
  return (
    <div className="mb-6">
      <div className="p-4 rounded-2xl border-4 border-gray-800 bg-amber-100 shadow-lg flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-gray-800">Number of liars</div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => isHost && setNumLiars(Math.max(1, numLiars - 1))}
            disabled={!isHost}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl border-4 border-gray-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
          >
            −
          </button>
          <div className="px-4 py-2 font-bold text-xl text-gray-800 min-w-[3rem] text-center">{numLiars}</div>
          <button
            onClick={() => isHost && setNumLiars(Math.min(max, numLiars + 1))}
            disabled={!isHost}
            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl border-4 border-gray-800 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
          >
            +
          </button>
        </div>
      </div>
      {!isHost && <div className="text-xs text-gray-600 mt-2 font-medium">Selected by host</div>}
    </div>
  );
};

export default NumOfLiarControl;
