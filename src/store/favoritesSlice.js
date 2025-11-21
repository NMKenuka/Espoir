
// src/store/favoritesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storageService } from '../services/storage';

export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async () => {
    return await storageService.getFavorites();
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        storageService.saveFavorites(state.items);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      storageService.saveFavorites(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;