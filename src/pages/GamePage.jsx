// pages/GamePage.jsx
// Purpose: Display the selected category and the secret word for the current user.
// Notes:
//  - `userWord` contains the word shown to the current client only.
//  - In a multi-user environment, selecting the liar and word should be performed
//    server-side to avoid leaking information client-side.
import React, { useState } from 'react';
import WordRevealer from '../components/WordRevealer.jsx';
import Button from '../components/button.jsx';
import Tips from '../components/Tips.jsx';

const GamePage = ({ userWord, wordRevealed, onToggleWord, isHost, onPlayAgain, onExitGame, selectedCategory }) => {
  const [feedback, setFeedback] = useState(null); // 'upvote', 'downvote', or null
  const [showThanks, setShowThanks] = useState(false);

  const handleFeedback = (type) => {
    setFeedback(type);
    setShowThanks(true);
    
    // Hide thanks message after 2 seconds
    setTimeout(() => setShowThanks(false), 2000);
    
    // TODO: Send feedback to backend
    console.log(`Feedback: ${type} for word "${userWord}" in category "${selectedCategory}"`);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto bg-amber-50 rounded-3xl shadow-2xl border-4 border-gray-800 p-8">
        
      
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Category</h3>
          <h2 className="text-3xl font-bold text-teal-500 drop-shadow-sm">{selectedCategory?.replace(/_/g, ' ') || '—'}</h2>
        </div>
        
        <WordRevealer word={userWord} isRevealed={wordRevealed} onToggle={onToggleWord} />

        {/* Feedback Section - Only show when word is actually revealed and has content */}
        {wordRevealed && userWord && (
          <div className="text-center mb-4">
            {showThanks ? (
              <p className="text-sm text-gray-600 font-medium animate-pulse">Thanks for your feedback!</p>
            ) : (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => handleFeedback('upvote')}
                  className={`w-8 h-8 rounded-full border-2 border-gray-800 transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                    feedback === 'upvote' 
                      ? 'bg-green-500 border-green-500' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  disabled={feedback !== null}
                >
                  <svg 
                    className={`w-4 h-4 ${feedback === 'upvote' ? 'text-white' : 'text-gray-800'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleFeedback('downvote')}
                  className={`w-8 h-8 rounded-full border-2 border-gray-800 transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                    feedback === 'downvote' 
                      ? 'bg-red-500 border-red-500' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  disabled={feedback !== null}
                >
                  <svg 
                    className={`w-4 h-4 transform rotate-180 ${feedback === 'downvote' ? 'text-white' : 'text-gray-800'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          {/* Tips component: shows a random tip each time the user's word changes */}
          <div className="text-sm">
            <Tips trigger={userWord} />
          </div>
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