export const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

export const selectRandomLiar = (players) => {
  return Math.floor(Math.random() * players.length);
};

// Select `count` unique random indices from the players array.
// Returns an array of indices (integers) with length <= count.
export const selectRandomLiars = (players, count = 1) => {
  const n = Math.max(0, Math.min(count, players.length));
  const indices = Array.from({ length: players.length }, (_, i) => i);
  // Fisher-Yates shuffle up to n picks
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, n);
};

export const getRandomWordPair = (category, wordCategories) => {
  const categoryWords = wordCategories[category];
  return categoryWords[Math.floor(Math.random() * categoryWords.length)];
};