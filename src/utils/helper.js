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

export const getRandomWordPair = (category, wordCategories) => {
  const categoryWords = wordCategories[category];
  return categoryWords[Math.floor(Math.random() * categoryWords.length)];
};