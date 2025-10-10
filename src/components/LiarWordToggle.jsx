import React from 'react';

// components/LiarWordToggle.jsx
// Toggle for host to choose between minority word vs "LIAR!" for liars
// Props:
//  - useLiarWord: boolean - true = use "LIAR!", false = use minority word
//  - setUseLiarWord: setter function
//  - isHost: whether current user can edit
const LiarWordToggle = ({ useLiarWord, setUseLiarWord, isHost = false }) => {
  return (
    <div className="mb-6">
      <div className="p-4 rounded-2xl border-4 border-gray-800 bg-amber-100 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-gray-800">Game Mode</div>
            <div className="text-xs text-gray-600 mt-1">
              {useLiarWord ? 'Liars get the word "LIAR!"' : 'Liar receives a different word'}
            </div>
          </div>
          <div className="flex items-center flex-shrink-0">
            <div className="relative">
              <button
                onClick={() => isHost && setUseLiarWord(!useLiarWord)}
                disabled={!isHost}
                className={`
                  relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200 ease-in-out border-2 border-gray-800
                  ${useLiarWord ? 'bg-red-500' : 'bg-green-500'}
                  ${!isHost ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                `}
              >
                <span
                  className={`
                    absolute inline-block h-6 w-6 rounded-full bg-white border-2 border-gray-800 transition-transform duration-200 ease-in-out
                    ${useLiarWord ? 'transform translate-x-7' : 'transform translate-x-0.5'}
                  `}
                />
              </button>
            </div>
            <div className="ml-3 text-sm font-bold">
              {useLiarWord ? (
                <span className="text-red-600">"LIAR!"</span>
              ) : (
                <span className="text-green-600">Category Word</span>
              )}
            </div>
          </div>
        </div>
        {!isHost && <div className="text-xs text-gray-600 mt-2 font-medium">Controlled by host</div>}
      </div>
    </div>
  );
};

export default LiarWordToggle;
