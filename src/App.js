import React, { useState, useEffect } from 'react';

// Import gameService for Supabase integration
import gameService from './utils/gameService';

// helper imports
import { copyToClipboard } from './utils/helper';
import { WORD_CATEGORIES } from './data/categories';

//  page imports
import HomePage from './pages/HomePage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import GamePage from './pages/GamePage.jsx';
import RulesModal from './components/RulesModal.jsx';
import NicknameModal from './components/NicknameModal.jsx';

export default function LiarWordGame() {
  const [page, setPage] = useState('home');
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  
  // Supabase-specific state
  const [roomId, setRoomId] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [realtimeChannel, setRealtimeChannel] = useState(null);
  
  const [players, setPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [numLiars, setNumLiars] = useState(1);
  const [userWord, setUserWord] = useState('');
  const [wordRevealed, setWordRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartNewGame = () => {
    console.log('🎮 Start New Game clicked');
    setShowNicknameModal(true);
    setIsHost(true);
  };

  const handleJoinGame = () => {
    console.log('🎮 Join Game clicked');
    setShowNicknameModal(true);
    setIsHost(false);
  };

  // Save to Supabase
  const handleNicknameSubmit = async ({ nickname, roomCode: inputRoomCode }) => {
    console.log('📝 Nickname submitted:', { nickname, isHost, inputRoomCode });
    setLoading(true);
    
    try {
      if (isHost) {
        // CREATE ROOM in Supabase
        console.log('🏠 Creating room in Supabase...');
        const { room, player } = await gameService.createRoom(nickname);
        
        console.log('✅ Room created:', room);
        console.log('✅ Player created:', player);
        
        setRoomCode(room.room_code);
        setRoomId(room.id);
        setPlayerId(player.id);
        setPlayers([player]);
        setPage('lobby');
        setShowNicknameModal(false);
        
        // Start heartbeat to keep player active
        gameService.startHeartbeatInterval(player.id);
        
        // Subscribe to real-time updates
        subscribeToRoom(room.id);
        
      } else {
        //  JOIN ROOM in Supabase
        console.log('🚪 Joining room in Supabase...');
        const { room, player } = await gameService.joinRoom(inputRoomCode, nickname);
        
        console.log('✅ Joined room:', room);
        console.log('✅ Player created:', player);
        
        setRoomCode(room.room_code);
        setRoomId(room.id);
        setPlayerId(player.id);
        setPage('lobby');
        setShowNicknameModal(false);
        
        // Start heartbeat
        gameService.startHeartbeatInterval(player.id);
        
        // Get all players and subscribe
        const { players: allPlayers } = await gameService.getRoomData(room.id);
        setPlayers(allPlayers);
        subscribeToRoom(room.id);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message || 'Failed to create/join room'}`);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  const subscribeToRoom = (currentRoomId) => {
    console.log('🔔 Subscribing to room updates:', currentRoomId);
    
    const channel = gameService.subscribeToRoom(currentRoomId, {
      onPlayerChange: async (payload) => {
        console.log('🔔 Player changed (payload):', payload);

        try {
          // Supabase payload shapes may vary depending on client version.
          // Common shapes: { new, old } or { record } or { record: { id, ... } }
          const newRow = payload?.new ?? payload?.record ?? null;
          const oldRow = payload?.old ?? null;

          setPlayers((prev = []) => {
            const list = Array.isArray(prev) ? [...prev] : [];

            // INSERT (no oldRow)
            if (newRow && !oldRow) {
              if (list.find(p => String(p.id) === String(newRow.id))) return list;
              return [...list, newRow];
            }

            // UPDATE
            if (newRow && oldRow) {
              return list.map(p => (String(p.id) === String(newRow.id) ? newRow : p));
            }

            // DELETE
            if (oldRow && !newRow) {
              return list.filter(p => String(p.id) !== String(oldRow.id));
            }

            return list;
          });

          // Safety net: if payload has no record information, refresh full list
          if (!payload?.new && !payload?.old && !payload?.record) {
            const { players: updatedPlayers } = await gameService.getRoomData(currentRoomId);
            console.log('✅ Fallback refreshed players list:', updatedPlayers);
            setPlayers(updatedPlayers);
          }
        } catch (error) {
          console.error('❌ Error handling player change:', error);
        }
      },
      onRoomUpdate: (payload) => {
        console.log('🔔 Room updated:', payload);
        // Handle room status changes if needed
        if (payload.new?.status === 'in_game') {
          // Game started, refresh word assignment
          gameService.getPlayerWord(playerId).then(({ assigned_word }) => {
            setUserWord(assigned_word);
            setPage('game');
          });
        }
      }
    });
    
    setRealtimeChannel(channel);
  };

  const handleCopyCode = async () => {
    const success = await copyToClipboard(roomCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReady = () => {
    if (isHost) {
      setPage('category');
    }
  };

  // ✅ UPDATED: Start game in Supabase
  const handleStartGame = async () => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    
    console.log('🎮 Starting game with category:', selectedCategory);
    setLoading(true);
    
    try {
      // Start game on server (assigns words to all players)
      await gameService.startGame(roomId, selectedCategory, WORD_CATEGORIES);
      
      // Get this player's assigned word
      const playerData = await gameService.getPlayerWord(playerId);
      setUserWord(playerData.assigned_word);
      
      console.log('✅ Game started, word assigned:', playerData.assigned_word);
      setPage('game');
      
    } catch (error) {
      console.error('❌ Error starting game:', error);
      alert('Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Exit game and cleanup
  const handleExitGame = async () => {
    console.log('👋 Exiting game');
    
    try {
      // Mark player as inactive in Supabase
      if (playerId) {
        await gameService.leaveRoom(playerId);
      }
      
      // Unsubscribe from real-time updates
      if (realtimeChannel) {
        gameService.unsubscribeFromRoom(realtimeChannel);
      }
      
      // Reset all state
      setPage('home');
      setRoomCode('');
      setRoomId('');
      setPlayerId('');
      setIsHost(false);
      setPlayers([]);
      setSelectedCategory('');
      setUserWord('');
      setWordRevealed(false);
      
      console.log('✅ Successfully exited game');
      
    } catch (error) {
      console.error('❌ Error exiting game:', error);
    }
  };

  // ✅ UPDATED: Play again (reset game)
  const handlePlayAgain = async () => {
    if (!isHost) {
      alert('Only the host can start a new round');
      return;
    }
    
    console.log('🔄 Starting new round');
    setLoading(true);
    
    try {
      await gameService.resetGame(roomId);
      
      setSelectedCategory('');
      setUserWord('');
      setWordRevealed(false);
      setPage('category');
      
      console.log('✅ Game reset successfully');
      
    } catch (error) {
      console.error('❌ Error resetting game:', error);
      alert('Failed to reset game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeChannel) {
        gameService.unsubscribeFromRoom(realtimeChannel);
      }
    };
  }, [realtimeChannel]);

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <p className="text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )}

      {page === 'home' && (
        <>
          <HomePage onStartNewGame={handleStartNewGame} onJoinGame={handleJoinGame} />
          <RulesModal isOpen={showRulesModal} onClose={() => setShowRulesModal(false)} />
          <NicknameModal
            isOpen={showNicknameModal}
            onClose={() => setShowNicknameModal(false)}
            isHost={isHost}
            onSubmit={handleNicknameSubmit}
          />
        </>
      )}
      
      {page === 'lobby' && (
        <LobbyPage
          roomCode={roomCode}
          players={players}
          isHost={isHost}
          onReady={handleReady}
          onCopyCode={handleCopyCode}
          copied={copied}
          onLeave={handleExitGame}
          numLiars={numLiars}
          setNumLiars={setNumLiars}
        />
      )}
      
      {page === 'category' && (
        <CategoryPage
          categories={Object.keys(WORD_CATEGORIES)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onStartGame={handleStartGame}
        />
      )}
      
      {page === 'game' && (
        <GamePage
          userWord={userWord}
          selectedCategory={selectedCategory}
          wordRevealed={wordRevealed}
          onToggleWord={() => setWordRevealed(!wordRevealed)}
          isHost={isHost}
          onPlayAgain={handlePlayAgain}
          onExitGame={handleExitGame}
        />
      )}
    </>
  );
}