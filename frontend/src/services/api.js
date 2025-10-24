import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel API
  withCredentials: true, // Required for Sanctum
  headers: {
    'Content-Type': 'application/json',
  },
});

// Make sure CSRF cookie is loaded before POST/PUT/DELETE
api.interceptors.request.use(async (config) => {
  await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });
  return config;
});

export default api;
