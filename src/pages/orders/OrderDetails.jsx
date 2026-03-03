import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://online-book-sharing-system-backend.onrender.com/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://online-book-sharing-system-backend.onrender.com/api/orders/confirm/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        alert('Delivery confirmed and payment released!');
        fetchOrder();
      }
    } catch (error) {
      alert('Failed to confirm delivery');
    }
  };

  const getProgressPercentage = () => {
    const statuses = ['Pending', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statuses.indexOf(order?.deliveryStatus);
    return ((currentIndex + 1) / statuses.length) * 100;
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">Order Details</h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Tracking ID:</span>
              <span className="font-semibold">{order.trackingId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Status:</span>
              <span className="font-semibold">{order.deliveryStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Status:</span>
              <span className="font-semibold">{order.paymentStatus}</span>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-4">Delivery Progress</h3>
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {['Pending', 'Shipped', 'Out for Delivery', 'Delivered'].map((status) => (
                  <div key={status} className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                      order.deliveryStatus === status ? 'bg-primary-600 text-white' : 'bg-gray-300'
                    }`}>
                      {status === order.deliveryStatus && '✓'}
                    </div>
                    <span className="text-xs">{status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {order.deliveryStatus === 'Delivered' && order.paymentStatus !== 'Released' && (
            <Button onClick={handleConfirmDelivery} className="w-full">
              Confirm Delivery
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};
