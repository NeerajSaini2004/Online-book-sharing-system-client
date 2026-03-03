import { apiService } from './api';

class AuthService {
  async login(credentials) {
    try {
      const data = await apiService.login(credentials);
      
      if (data.success && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please check if backend is running on port 5001.'
      };
    }
  }

  async register(userData) {
    try {
      const data = await apiService.register(userData);
      
      if (data.success && data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      console.error('Register error:', error);
      return {
        success: false,
        message: error.message || 'Network error. Please check if backend is running on port 5001.'
      };
    }
  }

  async checkBackendConnection() {
    try {
      await apiService.healthCheck();
      return true;
    } catch (error) {
      console.error('Backend connection failed:', error);
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();