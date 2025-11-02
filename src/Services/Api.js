import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});


export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);
export const getProfile = () => API.get('/users/profile');


export const getProducts = () => API.get('/products');

// Crear orden
export const createOrder = (user_id, items) =>
  API.post('/orders', { user_id, items });

// Obtener carrito de un usuario
export const getCart = (userId) => API.get(`/cart/${userId}`);

// Agregar producto al carrito
export const addToCart = (user_id, product_id, quantity) =>
    API.post('/cart', { user_id, product_id, quantity });

// Actualizar cantidad de un producto en el carrito
export const updateQuantity = (user_id, product_id, quantity) =>
    API.put('/cart', { user_id, product_id, quantity });

// Eliminar un producto específico del carrito
export const removeFromCart = (user_id, product_id) =>
    API.delete(`/cart/${user_id}/${product_id}`);

// Vaciar todo el carrito del usuario
export const clearCart = (user_id) => API.delete(`/cart/clear/${user_id}`);

export default API;
