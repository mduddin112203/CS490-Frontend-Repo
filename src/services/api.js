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
  searchFilms: (query) => api.get(`/films/search?q=${encodeURIComponent(query)}`),
  rentFilm: (filmId, customerId) => api.post(`/films/${filmId}/rent`, { customer_id: customerId }),
};

// Actors API
export const actorsAPI = {
  getTopActors: () => api.get('/actors/top'),
  getActorById: (id) => api.get(`/actors/${id}`),
};

// Customers API
export const customersAPI = {
  getCustomers: (page = 1, limit = 20, search = '') => {
    const params = new URLSearchParams({ page, limit });
    if (search.trim()) params.append('search', search.trim());
    return api.get(`/customers?${params.toString()}`);
  },
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post('/customers', data),
};

export default api;
