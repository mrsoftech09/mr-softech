import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY || 'mrsotech_secret_123'
  }
});

export const getData = u => api.get(u).then(r => r.data);

export const mutations = {
  post: (u, d) => api.post(u, d).then(r => r.data),
  patch: (u, d) => api.patch(u, d).then(r => r.data),
  delete: u => api.delete(u)
};