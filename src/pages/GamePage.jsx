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
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto bg-amber-50 rounded-3xl shadow-2xl border-4 border-gray-800 p-8">
        
      
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Category</h3>
          <h2 className="text-3xl font-bold text-teal-500 drop-shadow-sm">{selectedCategory?.replace(/_/g, ' ') || '—'}</h2>
        </div>
        
        <WordRevealer word={userWord} isRevealed={wordRevealed} onToggle={onToggleWord} />

        <div className="mb-6">
          {/* Tips component: shows a random tip each time the user's word changes */}
          <Tips trigger={userWord} />
        </div>

        <div className="space-y-4">
          {isHost && (
            <Button 
              onClick={onPlayAgain} 
              variant="success" 
              className="w-full py-4"
            >
              Play Another Round
            </Button>
          )}
          <Button 
            onClick={onExitGame} 
            variant="secondary" 
            className="w-full md:w-64 text-lg py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-2xl shadow-lg border-4 border-gray-800 transition-transform hover:scale-105 active:scale-95"
          >
            Exit Game
          </Button>
        </div>
        
        {/* Decorative dots */}
        <div className="flex justify-center gap-3 mt-8">
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-gray-800"></div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;