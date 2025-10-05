// pages/GamePage.jsx
// Purpose: Display the selected category and the secret word for the current user.
// Notes:
//  - `userWord` contains the word shown to the current client only.
//  - In a multi-user environment, selecting the liar and word should be performed
//    server-side to avoid leaking information client-side.
import React from 'react';
import WordRevealer from '../components/WordRevealer.jsx';
import Button from '../components/button.jsx';
import Tips from '../components/Tips.jsx';

const GamePage = ({ userWord, wordRevealed, onToggleWord, isHost, onPlayAgain, onExitGame, selectedCategory }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-8">
      <div className="w-full flex justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-[calc(100vw-2rem)] max-w-2xl">
          <p className="text-3xl text-gray-800 mb-2 text-center">Category</p>
          <h2 className="text-xl font-bold text-gray-600 mb-6 text-center">{selectedCategory || '—'}</h2>
          
          <WordRevealer word={userWord} isRevealed={wordRevealed} onToggle={onToggleWord} />

          <div className="mb-6">
            {/* Tips component: shows a random tip each time the user's word changes */}
            <Tips trigger={userWord} />
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