import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

//////////////////////////////////////////////////////////
// AUTH API
//////////////////////////////////////////////////////////

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/password", data),
};

//////////////////////////////////////////////////////////
// PRODUCT API
//////////////////////////////////////////////////////////

export const productAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (cat, params) =>
    api.get(`/products/category/${cat}`, { params }),
  search: (query) => api.get("/products/search", { params: { q: query } }),
  getFeatured: () => api.get("/products/featured"),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
};

//////////////////////////////////////////////////////////
// CART API
//////////////////////////////////////////////////////////

export const cartAPI = {
  get: () => api.get("/cart"),
  addItem: (data) => api.post("/cart/items", data),
  updateItem: (itemId, data) => api.put(`/cart/items/${itemId}`, data),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete("/cart"),
  applyCoupon: (code) => api.post("/cart/coupon", { code }),
};

//////////////////////////////////////////////////////////
// ORDER API
//////////////////////////////////////////////////////////

export const orderAPI = {
  create: (data) => api.post("/orders", data),
  getAll: () => api.get("/orders/admin/all"),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

//////////////////////////////////////////////////////////
// WISHLIST API
//////////////////////////////////////////////////////////

export const wishlistAPI = {
  get: () => api.get("/wishlist"),
  add: (productId) => api.post("/wishlist", { productId }),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
};

//////////////////////////////////////////////////////////
// AI API
//////////////////////////////////////////////////////////

export const aiAPI = {
  chat: (message, context) =>
    api.post("/ai/chat", { message, context }),
  getRecommendations: (userId) =>
    api.get(`/ai/recommendations/${userId}`),
  analyzeCart: (cartItems) =>
    api.post("/ai/analyze-cart", { cartItems }),
};

//////////////////////////////////////////////////////////
// NOTIFICATIONS API
//////////////////////////////////////////////////////////

export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put("/notifications/read-all"),
};

//////////////////////////////////////////////////////////
// ADMIN API (FIX FOR YOUR ERROR)
//////////////////////////////////////////////////////////

export const adminAPI = {
  // Products
  getProducts: () => api.get("/admin/products"),
  createProduct: (data) => api.post("/admin/products", data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  // Orders
  getOrders: () => api.get("/admin/orders"),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),

  // Users
  getUsers: () => api.get("/admin/users"),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Stats (new)
  getStats: () => api.get("/admin/stats"),
};

export default api;