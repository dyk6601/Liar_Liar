import { configureStore } from '@reduxjs/toolkit';
import { playersReducer } from './slices/playersSlice';

export const store = configureStore({
  reducer: {
    players: playersReducer,
  },
});

// Re-export all actions for easy importing
export {
  setPlayers,
  addPlayer,
  updatePlayer,
  removePlayer,
  clearPlayers,
} from './slices/playersSlice';