import React from 'react';
import { UsersIcon, CrownIcon } from './icons.jsx';

// components/PlayersList.jsx
// Renders a simple list of players. This component is defensive so it
// works with plain arrays from local state or rows returned by Supabase.
// Expected player shapes (flexible):
// { id, name } OR { id, nickname } OR Supabase row { id, nickname, is_host }
const PlayersList = ({ players }) => {
  // Defensive: ensure players is an array
  const list = Array.isArray(players) ? players : [];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon />
        <h3 className="text-xl font-bold text-gray-800">Players ({list.length})</h3>
      </div>

      {list.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-500">Waiting for players to join...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((player) => {
            // Support multiple possible name fields
            const playerName = player?.nickname || player?.name || player?.username || 'Unknown';
            // Supabase may use snake_case for host flag
            const isHost = player?.is_host ?? player?.isHost ?? false;
            const key = player?.id ?? playerName;

            return (
              <div
                key={key}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition"
              >
                <span className="font-medium text-gray-700">{playerName}</span>
                {isHost && (
                  <span className="flex items-center gap-1 text-yellow-600 text-sm">
                    <CrownIcon />
                    Host
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayersList;