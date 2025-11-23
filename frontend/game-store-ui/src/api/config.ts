import axios from 'axios';

// Cria a conexão. Se não tiver .env, usa o localhost:3000
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adiciona o token em todas as requisições se ele existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@GameStore:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;