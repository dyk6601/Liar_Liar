import React from 'react';
import RoomCode from '../components/RoomCode.jsx';
import QRCode from '../components/QRcode.jsx';
import PlayersList from '../components/PlayersList.jsx';
import Button from '../components/button.jsx';

const LobbyPage = ({ roomCode, players, isHost, onReady, onCopyCode, copied, onLeave }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Game Lobby</h2>
        
  <RoomCode code={roomCode} onCopy={onCopyCode} copied={copied} />
  <QRCode code={roomCode} />
        <PlayersList players={players} />

        {isHost ? (
          <Button onClick={onReady} variant="success" className="w-full">
            Ready?
          </Button>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-700 font-medium">Waiting for host to start the game...</p>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={onLeave} variant="outline" className="w-full">
            Leave Lobby
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;