
import axios from 'axios';

const TMDB_API_KEY = '7c3b76f41174c9e954312de1fccf151b'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const movieAPI = {
  // Get trending movies
  getTrending: async () => {
    const response = await api.get('/trending/movie/week');
    return response.data.results;
  },

  // Get popular movies
  getPopular: async () => {
    const response = await api.get('/movie/popular');
    return response.data.results;
  },

  // Get movie details
  getDetails: async (id) => {
    const response = await api.get(`/movie/${id}`);
    return response.data;
  },

  // Search movies
  search: async (query) => {
    const response = await api.get('/search/movie', {
      params: { query },
    });
    return response.data.results;
  },

  // Get image URL
  getImageUrl: (path) => {
    return path ? `${IMAGE_BASE_URL}${path}` : null;
  },
};

// Dummy Auth API (simulated)
export const authAPI = {
  login: async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          username: email.split('@')[0],
          email: email,
          token: 'dummy_token_' + Date.now(),
        });
      }, 1000);
    });
  },

  register: async (username, email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          username: username,
          email: email,
          token: 'dummy_token_' + Date.now(),
        });
      }, 1000);
    });
  },
};