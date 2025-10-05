import React from 'react';
import { UsersIcon, CrownIcon } from './icons.jsx';

const PlayersList = ({ players }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon />
        <h3 className="text-xl font-bold text-gray-800">Players ({players.length})</h3>
      </div>
      <div className="space-y-2">
        {players.map((player) => (
          <div key={player.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <span className="font-medium text-gray-700">{player.name}</span>
            {player.isHost && (
              <span className="flex items-center gap-1 text-yellow-600 text-sm">
                <CrownIcon />
                Host
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default PlayersList;