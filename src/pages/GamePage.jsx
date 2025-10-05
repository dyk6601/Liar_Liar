// pages/GamePage.jsx
import React from 'react';
import WordRevealer from '../components/WordRevealer.jsx';
import Button from '../components/button.jsx';

const GamePage = ({ userWord, wordRevealed, onToggleWord, isHost, onPlayAgain, onExitGame, selectedCategory }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <p className="text-3xl text-gray-800 mb-2 text-center">Category</p>
          <h2 className="text-xl font-bold text-gray-600 mb-6 text-center">{selectedCategory || '—'}</h2>
          
          <WordRevealer word={userWord} isRevealed={wordRevealed} onToggle={onToggleWord} />

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-center font-medium">
              Remember your word and give clues !
            </p>
          </div>

          <div className="space-y-3">
            {isHost && (
              <Button onClick={onPlayAgain} variant="success" className="w-full">
                Play Another Round
              </Button>
            )}
            <Button onClick={onExitGame} variant="danger" className="w-full">
              Exit Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;