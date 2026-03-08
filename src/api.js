import axios from 'axios';

// Dynamic backend URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL
});

// Ingredient endpoints (formerly products)
export const fetchProducts = () => API.get('/ingredients');
export const addProduct = (productData) => API.post('/ingredients', productData);
export const updateProduct = (id, productData) => API.put(`/ingredients/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/ingredients/${id}`);

// Menu endpoints
export const fetchMenus = () => API.get('/menus');
export const addMenu = (menuData) => API.post('/menus', menuData);
export const deleteMenu = (id) => API.delete(`/menus/${id}`);

// Transaction endpoints
export const fetchTransactions = () => API.get('/transactions');
export const addTransaction = (transactionData) => API.post('/transactions', transactionData);

export default API;
