
// src/store/moviesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { movieAPI } from '../services/api';

export const fetchTrending = createAsyncThunk(
  'movies/fetchTrending',
  async () => {
    return await movieAPI.getTrending();
  }
);

export const fetchPopular = createAsyncThunk(
  'movies/fetchPopular',
  async () => {
    return await movieAPI.getPopular();
  }
);

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchDetails',
  async (id) => {
    return await movieAPI.getDetails(id);
  }
);

export const searchMovies = createAsyncThunk(
  'movies/search',
  async (query) => {
    return await movieAPI.search(query);
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    popular: [],
    searchResults: [],
    selectedMovie: null,
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Trending
      .addCase(fetchTrending.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Popular
      .addCase(fetchPopular.fulfilled, (state, action) => {
        state.popular = action.payload;
      })
      // Fetch Details
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selectedMovie = action.payload;
      })
      // Search
      .addCase(searchMovies.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearch } = moviesSlice.actions;
export default moviesSlice.reducer;