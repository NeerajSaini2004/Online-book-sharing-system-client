const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class OrderService {
  async createOrder(orderData) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(orderData)
    });
    return response.json();
  }

  async getOrder(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async getUserOrders(role = '') {
    const response = await fetch(`${API_BASE_URL}/orders/user/all?role=${role}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async markAsShipped(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/ship/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async updateDeliveryStatus(orderId, deliveryStatus) {
    const response = await fetch(`${API_BASE_URL}/orders/update-status/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ deliveryStatus })
    });
    return response.json();
  }

  async confirmDelivery(orderId) {
    const response = await fetch(`${API_BASE_URL}/orders/confirm/${orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.json();
  }

  async processPaymentAndCreateOrder(paymentData, orderData) {
    const response = await fetch(`${API_BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        ...paymentData,
        orderData
      })
    });
    return response.json();
  }
}

export default new OrderService();