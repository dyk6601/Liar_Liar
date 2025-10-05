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
      <div className="p-4 rounded-lg border-2 border-gray-200 bg-white flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-700">Number of liars</div>
          <div className="text-xs text-gray-500">Liars receive the minority word.</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => isHost && setNumLiars(Math.max(1, numLiars - 1))}
            disabled={!isHost}
            className="px-3 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            −
          </button>
          <div className="px-4 py-2 font-bold text-lg">{numLiars}</div>
          <button
            onClick={() => isHost && setNumLiars(Math.min(max, numLiars + 1))}
            disabled={!isHost}
            className="px-3 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            +
          </button>
        </div>
      </div>
      {!isHost && <div className="text-xs text-gray-500 mt-2">Selected by host</div>}
    </div>
  );
};

export default NumOfLiarControl;
