import axios from 'axios';

// URL provisional para la API
const API_BASE_URL = 'https://api-tu-backend.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
