// API service for Panaghia app
const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}/api${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'API Error');
  }
  
  return response.json();
};

// ============== MENU API ==============

export const menuApi = {
  // Get all categories
  getCategories: () => apiCall('/menu/categories'),
  
  // Get all menu items
  getItems: (categoryId = null, popularOnly = false) => {
    let endpoint = '/menu/items';
    const params = new URLSearchParams();
    if (categoryId) params.append('category_id', categoryId);
    if (popularOnly) params.append('popular_only', 'true');
    if (params.toString()) endpoint += `?${params.toString()}`;
    return apiCall(endpoint);
  },
  
  // Get single menu item
  getItem: (itemId) => apiCall(`/menu/items/${itemId}`),
  
  // Get daily menu
  getDailyMenu: () => apiCall('/menu/daily'),
  
  // Get daily menu for specific day
  getDailyMenuByDay: (day) => apiCall(`/menu/daily/${day}`),
};

// ============== ORDERS API ==============

export const ordersApi = {
  // Create new order
  create: (orderData) => apiCall('/orders/', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  
  // Get order by ID
  get: (orderId) => apiCall(`/orders/${orderId}`),
  
  // Get order by order number
  getByNumber: (orderNumber) => apiCall(`/orders/number/${orderNumber}`),
  
  // Update order status
  updateStatus: (orderId, status) => apiCall(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  
  // Cancel order
  cancel: (orderId) => apiCall(`/orders/${orderId}`, {
    method: 'DELETE',
  }),
};

// ============== RESTAURANT API ==============

export const restaurantApi = {
  // Get restaurant info
  getInfo: () => apiCall('/restaurant/info'),
  
  // Get reviews
  getReviews: () => apiCall('/restaurant/reviews'),
  
  // Submit a review
  submitReview: (reviewData) => apiCall('/restaurant/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
};

// ============== HEALTH CHECK ==============

export const healthApi = {
  check: () => apiCall('/health'),
};

export default {
  menu: menuApi,
  orders: ordersApi,
  restaurant: restaurantApi,
  health: healthApi,
};
