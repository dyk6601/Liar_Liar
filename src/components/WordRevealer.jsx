// components/WordRevealer.jsx
// Presents the secret word to the user. Clicking toggles reveal state.
// Keep the reveal logic simple to allow the parent to control who sees the
// word (server-side selection is recommended in real apps).
import React from 'react';

const WordRevealer = ({ word, isRevealed, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className="bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-3xl p-12 mb-8 cursor-pointer transition-all transform hover:scale-105 active:scale-95 min-h-[300px] flex items-center justify-center shadow-2xl border-4 border-gray-800"
    >
      {isRevealed ? (
        <p className="text-5xl md:text-6xl font-bold text-white text-center drop-shadow-lg">{word}</p>
      ) : (
        <p className="text-2xl font-bold text-white text-center">
          👆 Tap to Reveal Your Word
        </p>
      )}
    </div>
  );
};
export default WordRevealer;