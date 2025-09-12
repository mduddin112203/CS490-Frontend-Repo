import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Films API
export const filmsAPI = {
  getTopRented: () => api.get('/films/top-rented'),
  getFilmById: (id) => api.get(`/films/${id}`),
};

export default api;
