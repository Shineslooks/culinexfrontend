import axios from 'axios';

// Create axios instance with backend URL
const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Product endpoints
export const fetchProducts = () => API.get('/products');
export const addProduct = (productData) => API.post('/products', productData);
export const updateProduct = (id, productData) => API.put(`/products/${id}`, productData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Transaction endpoints
export const fetchTransactions = () => API.get('/transactions');
export const addTransaction = (transactionData) => API.post('/transactions', transactionData);

export default API;
