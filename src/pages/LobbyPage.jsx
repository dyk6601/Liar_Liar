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
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto bg-amber-50 rounded-3xl shadow-2xl border-4 border-gray-800 p-8">
        
        {/* Yappie on Chair Image */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center shadow-lg border-4 border-gray-800 overflow-hidden">
            <img 
              src="/img/yappie_on_chair.png" 
              alt="Yappie on Chair"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to home emoji if image fails to load
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<span class="text-3xl">🏠</span>';
              }}
            />
          </div>
        </div>


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
          <Button 
            onClick={onReady} 
            variant="success" 
            className="w-full py-4"
          >
            Ready?
          </Button>
        ) : (
          <div className="bg-amber-100 border-4 border-gray-800 rounded-2xl p-4 text-center shadow-lg">
            <p className="text-gray-800 font-bold">Waiting for host to start the game...</p>
          </div>
        )}

        <div className="mt-4">
          <Button 
            onClick={onLeave} 
            variant="outline" 
            className="w-full py-4 bg-amber-50 hover:bg-amber-100 text-gray-800 font-bold rounded-2xl shadow-lg border-4 border-gray-800 transition-transform hover:scale-105 active:scale-95"
          >
            Leave Lobby
          </Button>
        </div>
        
        {/* Decorative dots */}
        <div className="flex justify-center gap-3 mt-6">
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;