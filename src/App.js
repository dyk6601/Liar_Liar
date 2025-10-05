import React, { useState } from 'react';

import { generateRoomCode, copyToClipboard, selectRandomLiar, getRandomWordPair } from './utils/helper';
import { WORD_CATEGORIES } from './data/categories';

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
  const [players, setPlayers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
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
    
    const wordPair = getRandomWordPair(selectedCategory, WORD_CATEGORIES);
    const liarIndex = selectRandomLiar(players);
    
    const currentUserId = 1;
    setUserWord(currentUserId === players[liarIndex].id ? wordPair.minority : wordPair.majority);
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