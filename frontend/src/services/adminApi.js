// Admin API service
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Get token from localStorage
const getToken = () => localStorage.getItem('adminToken');

// Helper function for authenticated API calls
const authApiCall = async (endpoint, options = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Nu sunteți autentificat');
  }

  const url = `${API_URL}/api${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
    throw new Error('Sesiune expirată');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'A apărut o eroare' }));
    throw new Error(error.detail || 'Eroare API');
  }
  
  return response.json();
};

// Public API call (no auth)
const publicApiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'A apărut o eroare' }));
    throw new Error(error.detail || 'Eroare API');
  }
  
  return response.json();
};

// ============== AUTH API ==============

export const authApi = {
  login: (email, password) => publicApiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  refresh: (refreshToken) => publicApiCall('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  }),
  
  logout: () => authApiCall('/auth/logout', { method: 'POST' }),
  
  me: () => authApiCall('/auth/me'),
  
  changePassword: (currentPassword, newPassword) => authApiCall('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  }),
  
  requestPasswordReset: (email) => publicApiCall('/auth/password-reset/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  
  confirmPasswordReset: (token, newPassword) => publicApiCall('/auth/password-reset/confirm', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
  }),
};

// ============== ADMIN API ==============

export const adminApi = {
  // Dashboard
  getDashboard: () => authApiCall('/admin/dashboard'),
  
  // Orders
  getOrders: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.date_to) queryParams.append('date_to', params.date_to);
    if (params.order_type) queryParams.append('order_type', params.order_type);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.skip) queryParams.append('skip', params.skip);
    const query = queryParams.toString();
    return authApiCall(`/admin/orders${query ? `?${query}` : ''}`);
  },
  
  updateOrderStatus: (orderId, status) => authApiCall(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Delivery
  getDeliveryOrders: (status = null) => {
    const query = status ? `?status=${status}` : '';
    return authApiCall(`/admin/delivery/orders${query}`);
  },
  
  updateDeliveryCoordinates: (orderId, lat, lng) => authApiCall(`/admin/delivery/orders/${orderId}/coordinates`, {
    method: 'PATCH',
    body: JSON.stringify({ lat, lng }),
  }),
  
  // Menu Categories
  createCategory: (category) => authApiCall('/admin/menu/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  
  updateCategory: (categoryId, category) => authApiCall(`/admin/menu/categories/${categoryId}`, {
    method: 'PUT',
    body: JSON.stringify(category),
  }),
  
  deleteCategory: (categoryId) => authApiCall(`/admin/menu/categories/${categoryId}`, {
    method: 'DELETE',
  }),
  
  // Menu Items
  createItem: (item) => authApiCall('/admin/menu/items', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  
  updateItem: (itemId, item) => authApiCall(`/admin/menu/items/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  
  deleteItem: (itemId) => authApiCall(`/admin/menu/items/${itemId}`, {
    method: 'DELETE',
  }),
  
  // Daily Menu
  updateDailyMenu: (menuId, menu) => authApiCall(`/admin/menu/daily/${menuId}`, {
    method: 'PUT',
    body: JSON.stringify(menu),
  }),
  
  // Reviews
  getReviews: (approved = null) => {
    const query = approved !== null ? `?approved=${approved}` : '';
    return authApiCall(`/admin/reviews${query}`);
  },
  
  approveReview: (reviewId, isApproved) => authApiCall(`/admin/reviews/${reviewId}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ is_approved: isApproved }),
  }),
  
  deleteReview: (reviewId) => authApiCall(`/admin/reviews/${reviewId}`, {
    method: 'DELETE',
  }),
};

// ============== PAYMENTS API ==============

export const paymentsApi = {
  createCheckout: (orderId, originUrl) => publicApiCall('/payments/checkout', {
    method: 'POST',
    body: JSON.stringify({ order_id: orderId, origin_url: originUrl }),
  }),
  
  getPaymentStatus: (sessionId) => publicApiCall(`/payments/status/${sessionId}`),
};

export default {
  auth: authApi,
  admin: adminApi,
  payments: paymentsApi,
};
