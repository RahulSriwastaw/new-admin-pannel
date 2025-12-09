import axios from 'axios';

// Point to the live backend server
const API_URL = 'https://new-backend-production-c886.up.railway.app/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  getProfile: () => api.get('/user/me'),
};

export const generate = {
  createImage: (prompt, modelId, aspectRatio) => api.post('/generate', { prompt, modelId, aspectRatio }),
};

export const wallet = {
  getPackages: () => api.get('/packages'),
};

export default api;