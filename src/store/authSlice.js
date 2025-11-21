
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';
import { storageService } from '../services/storage';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const user = await authAPI.login(email, password);
    await storageService.saveUser(user);
    return user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }) => {
    const user = await authAPI.register(username, email, password);
    await storageService.saveUser(user);
    return user;
  }
);

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async () => {
    const user = await storageService.getUser();
    return user;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await storageService.removeUser();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    isDarkMode: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      storageService.saveTheme(state.isDarkMode);
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Load User
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          state.isAuthenticated = false;
        }
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, toggleTheme, setTheme } = authSlice.actions;
export default authSlice.reducer;