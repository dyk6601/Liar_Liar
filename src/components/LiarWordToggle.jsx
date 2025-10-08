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
      <div className="p-4 rounded-lg border-2 border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-700">Liar Word Mode</div>
            <div className="text-xs text-gray-500 mt-1">
              {useLiarWord ? 'Liars get the word "LIAR!"' : 'Liars get a different word from the category'}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => isHost && setUseLiarWord(!useLiarWord)}
              disabled={!isHost}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${useLiarWord ? 'bg-red-500' : 'bg-green-500'}
                ${!isHost ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${useLiarWord ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
            <div className="ml-3 text-sm font-medium">
              {useLiarWord ? (
                <span className="text-red-600">"LIAR!"</span>
              ) : (
                <span className="text-green-600">Category Word</span>
              )}
            </div>
          </div>
        </div>
        {!isHost && <div className="text-xs text-gray-500 mt-2">Controlled by host</div>}
      </div>
    </div>
  );
};

export default LiarWordToggle;
