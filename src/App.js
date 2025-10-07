import React, { useState, useEffect, useRef } from 'react';

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
  const realtimeChannelRef = useRef(null);
  
  const [players, setPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [numLiars, setNumLiars] = useState(1);
  const [userWord, setUserWord] = useState('');
  const [wordRevealed, setWordRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Flag to prevent auto-sync after intentional exit
  const [hasExitedIntentionally, setHasExitedIntentionally] = useState(false);

  const handleStartNewGame = () => {
    console.log('🎮 Start New Game clicked');
    // Reset exit flag when starting new game
    setHasExitedIntentionally(false);
    setShowNicknameModal(true);
    setIsHost(true);
  };

  const handleJoinGame = () => {
    console.log('🎮 Join Game clicked');
    // Reset exit flag when joining new game
    setHasExitedIntentionally(false);
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
        
        // Get all players first (should just be the host)
        const { players: allPlayers } = await gameService.getRoomData(room.id);
        console.log('📊 Initial players:', allPlayers);
        setPlayers(allPlayers);
        
        // Subscribe to real-time updates BEFORE changing page
        subscribeToRoom(room.id, player.id);
        
        // Start heartbeat to keep player active
        gameService.startHeartbeatInterval(player.id);
        
        setPage('lobby');
        setShowNicknameModal(false);
        
      } else {
        //  JOIN ROOM in Supabase
        console.log('🚪 Joining room in Supabase...');
        const { room, player } = await gameService.joinRoom(inputRoomCode, nickname);
        
        console.log('✅ Joined room:', room);
        console.log('✅ Player created:', player);
        
        setRoomCode(room.room_code);
        setRoomId(room.id);
        setPlayerId(player.id);
        
        // Get all players and subscribe
        const { players: allPlayers } = await gameService.getRoomData(room.id);
        console.log('📊 All players in room:', allPlayers);
        setPlayers(allPlayers);
        
        // Subscribe to real-time updates BEFORE changing page
        subscribeToRoom(room.id, player.id);
        
        // Start heartbeat
        gameService.startHeartbeatInterval(player.id);
        
        setPage('lobby');
        setShowNicknameModal(false);
      }
    } catch (error) {
      console.error('❌ Error:', error);
      alert(`Error: ${error.message || 'Failed to create/join room'}`);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  const subscribeToRoom = (currentRoomId, currentPlayerId) => {
    console.log('🔔 Setting up subscription for room:', currentRoomId);
    console.log('🔔 Player ID for subscription:', currentPlayerId);
    
    const channel = gameService.subscribeToRoom(currentRoomId, {
      onPlayerChange: (normalized) => {
        try {
          console.log('🔔 onPlayerChange callback triggered:', normalized);
          
          // normalized: { type, new, old, raw }
          const { type, new: newRow, old: oldRow } = normalized;

          setPlayers((prev) => {
            console.log('🔔 Current players state:', prev);
            const list = Array.isArray(prev) ? [...prev] : [];

            if ((type === 'INSERT' || type === 'insert') && newRow) {
              console.log('➕ Adding new player:', newRow);
              if (!list.find(p => String(p.id) === String(newRow.id))) {
                const updated = [...list, newRow];
                console.log('✅ Updated players list:', updated);
                return updated;
              }
              console.log('⚠️ Player already exists, skipping');
              return list;
            }

            if ((type === 'UPDATE' || type === 'update') && newRow) {
              console.log('🔄 Updating player:', newRow);
              const updated = list.map(p => (String(p.id) === String(newRow.id) ? newRow : p));
              console.log('✅ Updated players list:', updated);
              return updated;
            }

            if ((type === 'DELETE' || type === 'delete') && oldRow) {
              console.log('➖ Removing player:', oldRow);
              const updated = list.filter(p => String(p.id) !== String(oldRow.id));
              console.log('✅ Updated players list:', updated);
              return updated;
            }

            console.log('⚠️ No matching action for type:', type);
            return list;
          });
        } catch (error) {
          console.error('❌ Error in onPlayerChange callback:', error);
        }
      },
      onRoomUpdate: (payload) => {
        try {
          console.log('🔔 onRoomUpdate callback triggered:', payload);
          console.log('🔔 Room status:', payload?.new?.status);
          
          if (payload?.new?.status === 'in_game') {
            console.log('🎮 Game starting, fetching player word...');
            console.log('🎮 Using player ID:', currentPlayerId);
            console.log('🎮 Room data:', payload?.new);
            
            // Set the selected category from room data
            if (payload?.new?.selected_category) {
              console.log('✅ Setting category from room update:', payload.new.selected_category);
              setSelectedCategory(payload.new.selected_category);
            }
            
            gameService.getPlayerWord(currentPlayerId).then(({ assigned_word }) => {
              console.log('✅ Player word received:', assigned_word);
              setUserWord(assigned_word);
              setPage('game');
            }).catch((error) => {
              console.error('❌ Error fetching player word:', error);
            });
          } else if (payload?.new?.status === 'waiting') {
            console.log('🔄 Game reset, returning to lobby...');
            
            // Reset game-related state for non-host players
            if (!isHost) {
              setSelectedCategory('');
              setUserWord('');
              setWordRevealed(false);
              setPage('lobby');
              console.log('✅ Non-host player returned to lobby');
            }
          }
        } catch (error) {
          console.error('❌ Error in onRoomUpdate callback:', error);
        }
      }
    });

    realtimeChannelRef.current = channel;
    console.log('✅ Subscription setup complete, channel stored in ref');
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
    console.log('👋 Exiting game intentionally');
    
    // Set flag to prevent auto-sync from bringing user back
    setHasExitedIntentionally(true);
    
    try {
      // Mark player as inactive in Supabase
      if (playerId) {
        await gameService.leaveRoom(playerId);
      }
      
      // Unsubscribe from real-time updates
      if (realtimeChannelRef.current) {
        gameService.unsubscribeFromRoom(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
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

  // ✅ Handle app focus/visibility changes (screen lock/unlock)
  useEffect(() => {
    let syncInterval = null;
    
    const handleVisibilityChange = async () => {
      console.log('👁️ Visibility changed:', document.visibilityState);
      
      // Don't sync if user has intentionally exited
      if (hasExitedIntentionally) {
        console.log('🚫 Skipping sync - user has exited intentionally');
        return;
      }
      
      if (document.visibilityState === 'visible' && playerId && roomId) {
        console.log('🔄 App became visible, performing full sync...');
        await performFullSync();
        
        // Start periodic sync check while app is visible
        startPeriodicSync();
      } else if (document.visibilityState === 'hidden') {
        console.log('💤 App went to background, stopping periodic sync');
        stopPeriodicSync();
      }
    };
    
    const performFullSync = async () => {
      // Don't sync if user has intentionally exited
      if (hasExitedIntentionally) {
        console.log('🚫 Skipping performFullSync - user has exited intentionally');
        return;
      }
      
      try {
        const syncData = await gameService.forceSync(playerId, roomId);
        console.log('📊 Full sync complete:', syncData);
        
        setPlayers(syncData.players);
        
        // Update game state if changed
        if (syncData.room.status === 'in_game') {
          console.log('🎮 Game is active after sync');
          
          if (syncData.room.selected_category !== selectedCategory) {
            console.log('📂 Category synced:', selectedCategory, '→', syncData.room.selected_category);
            setSelectedCategory(syncData.room.selected_category);
          }
          
          if (syncData.playerWord !== userWord) {
            console.log('📝 Word synced:', userWord, '→', syncData.playerWord);
            setUserWord(syncData.playerWord);
          }
          
          if (page !== 'game') {
            console.log('📱 Redirecting to game page');
            setPage('game');
          }
        } else if (syncData.room.status === 'waiting' && page === 'game') {
          console.log('🔄 Game was reset, returning to lobby');
          setSelectedCategory('');
          setUserWord('');
          setWordRevealed(false);
          setPage('lobby');
        }
        
      } catch (error) {
        console.error('❌ Error in full sync:', error);
      }
    };
    
    const startPeriodicSync = () => {
      // Check for updates every 10 seconds while app is visible
      syncInterval = setInterval(async () => {
        // Don't sync if user has intentionally exited
        if (hasExitedIntentionally) {
          console.log('🚫 Skipping periodic sync - user has exited intentionally');
          stopPeriodicSync();
          return;
        }
        
        if (document.visibilityState === 'visible' && playerId && roomId) {
          console.log('🔄 Periodic sync check...');
          
          // Check connection health
          const isHealthy = gameService.checkConnectionHealth(realtimeChannelRef.current);
          if (!isHealthy) {
            console.log('⚠️ Connection unhealthy, performing sync...');
            await performFullSync();
          }
        }
      }, 10000); // 10 seconds
    };
    
    const stopPeriodicSync = () => {
      if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
      }
    };
    
    // Initial setup
    if (playerId && roomId) {
      if (document.visibilityState === 'visible') {
        startPeriodicSync();
      }
    }
    
    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
      stopPeriodicSync();
    };
  }, [playerId, roomId, userWord, selectedCategory, page]);

  // ✅ NEW: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (realtimeChannelRef.current) {
        gameService.unsubscribeFromRoom(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, []);

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