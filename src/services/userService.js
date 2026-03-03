const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://online-book-sharing-system-backend.onrender.com/api';

class UserService {
  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });
    return response.json();
  }

  async uploadKYCDocuments(formData) {
    const response = await fetch(`${API_BASE_URL}/users/kyc/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return response.json();
  }

  async getKYCStatus() {
    const response = await fetch(`${API_BASE_URL}/users/kyc/status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async updatePassword(passwordData) {
    const response = await fetch(`${API_BASE_URL}/users/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(passwordData)
    });
    return response.json();
  }
}

export default new UserService();