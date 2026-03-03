// const API_BASE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://your-backend-url.com/api' 
//   : 'http://localhost:5001/api';
const API_BASE_URL = 'http://localhost:5001/api';
class ApiService {
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateProfile(data) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getListings(params) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_BASE_URL}/listings?${queryString}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMyListings() {
    const response = await fetch(`${API_BASE_URL}/listings/my`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createListing(data) {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(data).forEach(key => {
      if (key === 'bookImage' && data[key]) {
        formData.append('bookImage', data[key]);
      } else if (key === 'images' && Array.isArray(data[key])) {
        formData.append('images', JSON.stringify(data[key]));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async updateListing(id, data) {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.keys(data).forEach(key => {
      if (key === 'bookImage' && data[key]) {
        formData.append('bookImage', data[key]);
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData,
    });
    return this.handleResponse(response);
  }

  async deleteListing(id) {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createOrder(data) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getMyOrders() {
    const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMySales() {
    const response = await fetch(`${API_BASE_URL}/orders/my-sales`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateOrderStatus(id, status, trackingInfo) {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, trackingInfo }),
    });
    return this.handleResponse(response);
  }

  async createBlog(data) {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getBlogs() {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    return this.handleResponse(response);
  }

  async getBlog(id) {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`);
    return this.handleResponse(response);
  }

  async uploadNotes(data) {
    const response = await fetch(`${API_BASE_URL}/notes/upload`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getNotes() {
    const response = await fetch(`${API_BASE_URL}/notes`);
    return this.handleResponse(response);
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  }

  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/test`);
      return this.handleResponse(response);
    } catch (error) {
      throw new Error('Frontend-Backend connection failed');
    }
  }

  // Wishlist methods
  async getWishlist() {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async addToWishlist(listingId) {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ listingId }),
    });
    return this.handleResponse(response);
  }

  async removeFromWishlist(listingId) {
    const response = await fetch(`${API_BASE_URL}/wishlist/${listingId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async checkWishlistItem(listingId) {
    const response = await fetch(`${API_BASE_URL}/wishlist/check/${listingId}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();