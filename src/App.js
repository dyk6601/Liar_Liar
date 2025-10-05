import React, { useState } from 'react';

/*
  App entry (LiarWordGame)
  - High level single-file router: `page` controls which top-level page renders.
  - Local state here models a single-session, in-memory game; in a real multi-user app
    this would be backed by a server or realtime DB (e.g., Supabase) and player IDs
    would be stable and globally unique.
  - Keep this component focused on orchestration: validate important flows here
    (e.g., don't start a game without a selected category).
*/
import { generateRoomCode, copyToClipboard, selectRandomLiar, selectRandomLiars, getRandomWordPair } from './utils/helper';
import { WORD_CATEGORIES } from './data/categories';

/* Pages and modals are intentionally small and presentational. App wires them together. */
import HomePage from './pages/HomePage.jsx';
import LobbyPage from './pages/LobbyPage.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import GamePage from './pages/GamePage.jsx';
import RulesModal from './components/RulesModal.jsx';
import NicknameModal from './components/NicknameModal.jsx';

export default function LiarWordGame() {
  const [page, setPage] = useState('home');
  // `page` acts as a tiny router: home -> lobby -> category -> game
  const [showRulesModal, setShowRulesModal] = useState(true);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [numLiars, setNumLiars] = useState(1);
  const [userWord, setUserWord] = useState('');
  const [wordRevealed, setWordRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleStartNewGame = () => {
    setShowNicknameModal(true);
    setIsHost(true);
  };

  const handleJoinGame = () => {
    setShowNicknameModal(true);
    setIsHost(false);
  };

  const handleNicknameSubmit = ({ nickname, roomCode: inputRoomCode }) => {
    // Minimal local player management: host creates the room code and becomes
    // the first player. Non-hosts enter an existing room code.
    if (isHost) {
      const code = generateRoomCode();
      setRoomCode(code);
      setPlayers([{ id: 1, name: nickname, isHost: true }]);
      setPage('lobby');
    } else {
      setRoomCode(inputRoomCode);
      setPlayers([{ id: 1, name: nickname, isHost: false }]);
      setPage('lobby');
    }
    // Close the nickname modal once we've captured the player's intent.
    setShowNicknameModal(false);
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

  const handleStartGame = () => {
    if (!selectedCategory) return;
  // Pick a word-pair from the chosen category and randomly select the liars.
  // In production this should be done server-side to avoid leaking info.
  const wordPair = getRandomWordPair(selectedCategory, WORD_CATEGORIES);
  const liarIndices = selectRandomLiars(players, numLiars);

  // For this single-client demo the current user is player 1. Real deployments
  // should map the signed-in user's ID here.
  const currentUserId = 1;
  const currentIndex = players.findIndex((p) => p.id === currentUserId);
  const isLiar = liarIndices.includes(currentIndex);
  setUserWord(isLiar ? wordPair.minority : wordPair.majority);
  setPage('game');
  };

  const handleExitGame = () => {
    setPage('home');
    setRoomCode('');
    setIsHost(false);
    setPlayers([]);
    setSelectedCategory('');
    setUserWord('');
    setWordRevealed(false);
  };

  const handlePlayAgain = () => {
    if (isHost) {
      setSelectedCategory('');
      setUserWord('');
      setWordRevealed(false);
      setPage('category');
    }
  };

  return (
    <>
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