import React from 'react';
import RoomCode from '../components/RoomCode.jsx';
import QRCode from '../components/QRcode.jsx';
import PlayersList from '../components/PlayersList.jsx';
import NumOfLiarControl from '../components/NumOfLiarControl.jsx';
import LiarWordToggle from '../components/LiarWordToggle.jsx';
import Button from '../components/button.jsx';

// pages/LobbyPage.jsx
// Purpose: Show room information and connected players.
// Props:
//  - roomCode: string (6-char code for this room)
//  - players: array of {id,name,isHost}
//  - isHost: boolean - enables host-only actions
//  - onReady: host action to advance to category selection
//  - onCopyCode: copy room code to clipboard
//  - copied: visual feedback flag
//  - onLeave: leave the lobby and reset local state
const LobbyPage = ({ roomCode, players, isHost, onReady, onCopyCode, copied, onLeave, numLiars, setNumLiars, useLiarWord, setUseLiarWord }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8">

  <RoomCode code={roomCode} onCopy={onCopyCode} copied={copied} />
  <QRCode code={roomCode} />

  {isHost && (
    <>
      <NumOfLiarControl numLiars={numLiars} setNumLiars={setNumLiars} players={players} isHost={isHost} />
      <LiarWordToggle useLiarWord={useLiarWord} setUseLiarWord={setUseLiarWord} isHost={isHost} />
    </>
  )}

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