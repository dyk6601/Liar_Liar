import { createSlice } from '@reduxjs/toolkit';

const playersSlice = createSlice({
  name: 'players',
  initialState: {
    list: [],
  },
  reducers: {
    setPlayers(state, action) {
      state.list = action.payload;
    },
    addPlayer(state, action) {
      // Only add if player doesn't already exist
      if (!state.list.find(p => String(p.id) === String(action.payload.id))) {
        state.list.push(action.payload);
      }
    },
    updatePlayer(state, action) {
      const index = state.list.findIndex(p => String(p.id) === String(action.payload.id));
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    removePlayer(state, action) {
      state.list = state.list.filter(p => String(p.id) !== String(action.payload));
    },
    clearPlayers(state) {
      state.list = [];
    },
  },
});

export const {
  setPlayers,
  addPlayer,
  updatePlayer,
  removePlayer,
  clearPlayers,
} = playersSlice.actions;

export const playersReducer = playersSlice.reducer;