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
  searchFilms: (filters) => {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.actorName) params.append('actorName', filters.actorName);
    if (filters.genre) params.append('genre', filters.genre);
    return api.get(`/films/search?${params.toString()}`);
  },
  getFilms: (page = 1, limit = 20) => api.get(`/films?page=${page}&limit=${limit}`),
  rentFilm: (filmId, customerId, storeId) => api.post(`/films/${filmId}/rent`, { customer_id: customerId, store_id: storeId }),
};

// Actors API
export const actorsAPI = {
  getTopActors: () => api.get('/actors/top'),
  getActorById: (id) => api.get(`/actors/${id}`),
  getActorTopRentedFilms: (id) => api.get(`/actors/${id}/top-rented-films`),
  searchActors: (query) => api.get(`/actors/search/${query}`),
};

// Customers API
export const customersAPI = {
  getCustomers: (page = 1, limit = 20) => api.get(`/customers?page=${page}&limit=${limit}`),
  searchCustomers: (filters) => {
    const params = new URLSearchParams();
    if (filters.customerId) params.append('customerId', filters.customerId);
    if (filters.name) params.append('name', filters.name);
    return api.get(`/customers/search?${params.toString()}`);
  },
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (customerData) => api.post('/customers', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}`, customerData),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  returnRental: (customerId, rentalId) => api.post(`/customers/${customerId}/return-rental`, { rental_id: rentalId }),
};

export default api;
