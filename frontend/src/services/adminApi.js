 // Admin API service

const API_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : '');

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
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  });

  if (response.status === 401) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
    throw new Error('Sesiune expirată');
  }

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'A apărut o eroare' }));

    throw new Error(error.detail || 'Eroare API');
  }

  return response.json();
};

// Public API call
const publicApiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: 'A apărut o eroare' }));

    throw new Error(error.detail || 'Eroare API');
  }

  return response.json();
};

// ============== AUTH API ==============

export const authApi = {
  login: (email, password) =>
    publicApiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    }),

  verifyOtp: (email, code) =>
    publicApiCall('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code,
      }),
    }),

  refresh: (refreshToken) =>
    publicApiCall('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    }),

  logout: () =>
    authApiCall('/auth/logout', {
      method: 'POST',
    }),

  me: () => authApiCall('/auth/me'),

  changePassword: (currentPassword, newPassword) =>
    authApiCall('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }),

  requestPasswordReset: (email) =>
    publicApiCall('/auth/password-reset/request', {
      method: 'POST',
      body: JSON.stringify({
        email,
      }),
    }),

  confirmPasswordReset: (token, newPassword) =>
    publicApiCall('/auth/password-reset/confirm', {
      method: 'POST',
      body: JSON.stringify({
        token,
        new_password: newPassword,
      }),
    }),
};

// ============== ADMIN API ==============

export const adminApi = {
  getDashboard: () => authApiCall('/admin/dashboard'),

  getOrders: (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.status) {
      queryParams.append('status', params.status);
    }

    if (params.date_from) {
      queryParams.append('date_from', params.date_from);
    }

    if (params.date_to) {
      queryParams.append('date_to', params.date_to);
    }

    if (params.order_type) {
      queryParams.append('order_type', params.order_type);
    }

    if (params.limit) {
      queryParams.append('limit', params.limit);
    }

    if (params.skip) {
      queryParams.append('skip', params.skip);
    }

    const query = queryParams.toString();

    return authApiCall(
      `/admin/orders${query ? `?${query}` : ''}`
    );
  },

  updateOrderStatus: (orderId, status) =>
    authApiCall(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
      }),
    }),

  getDeliveryOrders: (status = null) => {
    const query = status ? `?status=${status}` : '';

    return authApiCall(`/admin/delivery/orders${query}`);
  },

  updateDeliveryCoordinates: (orderId, lat, lng) =>
    authApiCall(
      `/admin/delivery/orders/${orderId}/coordinates`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          lat,
          lng,
        }),
      }
    ),

  createCategory: (category) =>
    authApiCall('/admin/menu/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    }),

  updateCategory: (categoryId, category) =>
    authApiCall(`/admin/menu/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    }),

  deleteCategory: (categoryId) =>
    authApiCall(`/admin/menu/categories/${categoryId}`, {
      method: 'DELETE',
    }),

  createItem: (item) =>
    authApiCall('/admin/menu/items', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  updateItem: (itemId, item) =>
    authApiCall(`/admin/menu/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  deleteItem: (itemId) =>
    authApiCall(`/admin/menu/items/${itemId}`, {
      method: 'DELETE',
    }),

  updateDailyMenu: (menuId, menu) =>
    authApiCall(`/admin/menu/daily/${menuId}`, {
      method: 'PUT',
      body: JSON.stringify(menu),
    }),

  getTeam: () => authApiCall('/admin/team'),

  createTeamMember: (member) =>
    authApiCall('/admin/team', {
      method: 'POST',
      body: JSON.stringify(member),
    }),

  updateTeamMember: (memberId, member) =>
    authApiCall(`/admin/team/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(member),
    }),

  deleteTeamMember: (memberId) =>
    authApiCall(`/admin/team/${memberId}`, {
      method: 'DELETE',
    }),

  uploadTeamImage: async (file) => {
    const token = getToken();
    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(
      `${API_URL}/api/admin/upload-image`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ detail: 'Eroare upload' }));

      throw new Error(error.detail || 'Eroare upload');
    }

    return response.json();
  },

  getReviews: (approved = null) => {
    const query =
      approved !== null ? `?approved=${approved}` : '';

    return authApiCall(`/admin/reviews${query}`);
  },

  approveReview: (reviewId, isApproved) =>
    authApiCall(`/admin/reviews/${reviewId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({
        is_approved: isApproved,
      }),
    }),

  deleteReview: (reviewId) =>
    authApiCall(`/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    }),
};

// ============== PAYMENTS API ==============

export const paymentsApi = {
  createCheckout: (orderId, originUrl) =>
    publicApiCall('/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({
        order_id: orderId,
        origin_url: originUrl,
      }),
    }),

  getPaymentStatus: (sessionId) =>
    publicApiCall(`/payments/status/${sessionId}`),
};

const api = {
  auth: authApi,
  admin: adminApi,
  payments: paymentsApi,
};

export default api;