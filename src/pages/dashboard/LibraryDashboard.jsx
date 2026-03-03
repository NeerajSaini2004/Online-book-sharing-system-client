import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const LibraryDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [libraryMessages, setLibraryMessages] = useState([]);
  const [orderStatus, setOrderStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const generateInvoice = (order) => {
    const invoiceData = `
INVOICE
=======
Invoice #: INV-${order.id}${Date.now()}
Date: ${new Date().toLocaleDateString()}

From:
Online Book Sharing Library
Library Management System

To:
${order.buyer}

Order Details:
--------------
Book: ${order.book}
Amount: ₹${order.amount}
Status: ${order.status}
Order Date: ${order.date}

Payment Summary:
----------------
Subtotal: ₹${order.amount}
Tax (18%): ₹${(order.amount * 0.18).toFixed(2)}
Total: ₹${(order.amount * 1.18).toFixed(2)}

Thank you for your business!
    `;
    const blob = new Blob([invoiceData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${order.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadMessages = () => {
    const messages = JSON.parse(localStorage.getItem('libraryMessages') || '[]');
    setLibraryMessages(messages);
  };

  const generateReport = () => {
    const reportData = `
SALES ANALYTICS REPORT
======================
Generated: ${new Date().toLocaleString()}

This Month Sales: ₹45,200
Total Books Sold: 156
Average Order Value: ₹290

Top Categories:
- Computer Science: 80%
- Mathematics: 60%
- Physics: 40%

Total Books in Inventory: 2,450
Active Listings: 156
Orders This Month: 89
    `;
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Books', value: '2,450', icon: BookOpenIcon, color: 'text-blue-600' },
    { label: 'Monthly Revenue', value: '₹45,200', icon: CurrencyRupeeIcon, color: 'text-green-600' },
    { label: 'Active Listings', value: '156', icon: EyeIcon, color: 'text-purple-600' },
    { label: 'Orders This Month', value: '89', icon: ShoppingBagIcon, color: 'text-orange-600' }
  ];

  const recentOrders = [
    {
      id: 1,
      book: 'Introduction to Algorithms',
      buyer: 'Rahul Kumar',
      amount: 450,
      status: 'completed',
      date: '2 hours ago'
    },
    {
      id: 2,
      book: 'Database System Concepts',
      buyer: 'Priya Sharma',
      amount: 400,
      status: 'shipped',
      date: '1 day ago'
    }
  ];

  const inventory = [
    {
      id: 1,
      title: 'Physics for Engineers',
      author: 'Halliday & Resnick',
      stock: 15,
      price: 350,
      status: 'in-stock'
    },
    {
      id: 2,
      title: 'Mathematics for ML',
      author: 'Marc Peter Deisenroth',
      stock: 3,
      price: 500,
      status: 'low-stock'
    }
  ];

  const bookRequests = [
    {
      id: 1,
      title: 'Advanced Data Structures',
      author: 'Peter Brass',
      requestedBy: 'Central Library',
      urgency: 'high',
      budget: '₹800',
      description: 'Need for Computer Science department',
      date: '2 days ago',
      status: 'open'
    },
    {
      id: 2,
      title: 'Machine Learning Yearning',
      author: 'Andrew Ng',
      requestedBy: 'City Library',
      urgency: 'medium',
      budget: '₹600',
      description: 'Popular demand from students',
      date: '1 week ago',
      status: 'fulfilled'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'orders', label: 'Orders' },
    { id: 'requests', label: 'Book Requests' },
    { id: 'analytics', label: 'Analytics' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">Library Dashboard</h1>
          <p className="text-secondary-600">Manage your library inventory and track sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-secondary-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-secondary-100 ${stat.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-bold text-secondary-900">Recent Orders</h3>
                  <Button onClick={() => setActiveTab('orders')} variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg shadow-soft">
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">{order.book}</h4>
                        <p className="text-sm text-secondary-600">Buyer: {order.buyer}</p>
                        <p className="text-xs text-secondary-500">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">₹{order.amount}</p>
                        <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-bold text-secondary-900">Inventory Status</h3>
                  <Button onClick={() => setActiveTab('inventory')} variant="outline" size="sm">Manage</Button>
                </div>
                <div className="space-y-3">
                  {inventory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg shadow-soft">
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">{item.title}</h4>
                        <p className="text-sm text-secondary-600">{item.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">Stock: {item.stock}</p>
                        <Badge variant={item.status === 'low-stock' ? 'warning' : 'success'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'inventory' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">Inventory Management</h3>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowBulkUploadModal(true)} variant="outline">
                    Bulk Upload
                  </Button>
                  <Button onClick={() => setShowAddBookModal(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add New Book
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200">
                    <div className="w-16 h-20 bg-secondary-200 rounded overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <BookOpenIcon className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900">{item.title}</h4>
                      <p className="text-sm text-secondary-600 mb-2">{item.author}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-secondary-600">Stock: {item.stock}</span>
                        <span className="text-primary-600">Price: ₹{item.price}</span>
                        <Badge variant={item.status === 'low-stock' ? 'warning' : 'success'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => { setSelectedBook(item); setShowEditModal(true); }} variant="outline" size="sm">Edit</Button>
                      <Button onClick={() => { setSelectedBook(item); setShowStockModal(true); }} variant="outline" size="sm">Update Stock</Button>
                      <Button onClick={() => { setSelectedBook(item); setShowBarcodeModal(true); }} size="sm">Barcode</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">Order Management</h3>
                <div className="flex space-x-2">
                  <Button onClick={() => alert('Orders filtered successfully')} variant="outline" size="sm">Filter</Button>
                  <Button onClick={() => alert('Report exported successfully')} variant="outline" size="sm">Export</Button>
                </div>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200">
                    <div className="w-16 h-20 bg-secondary-200 rounded overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <ShoppingBagIcon className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900">{order.book}</h4>
                      <p className="text-sm text-secondary-600 mb-2">Buyer: {order.buyer}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-secondary-600">Amount: ₹{order.amount}</span>
                        <span className="text-secondary-600">{order.date}</span>
                        <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => { setSelectedOrder(order); setOrderStatus(order.status); setTrackingNumber(''); setShowProcessModal(true); }} variant="outline" size="sm">Process</Button>
                      <Button onClick={() => generateInvoice(order)} variant="outline" size="sm">Invoice</Button>
                      <Button onClick={() => { setSelectedOrder(order); setShowChatModal(true); setChatMessages([{ sender: 'buyer', text: `Hi, I ordered ${order.book}` }]); }} size="sm">Chat</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'requests' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">Book Requests</h3>
                <div className="flex space-x-2">
                  <Button onClick={() => { loadMessages(); setShowMessagesModal(true); }} variant="outline">
                    Messages ({JSON.parse(localStorage.getItem('libraryMessages') || '[]').filter(m => !m.read).length})
                  </Button>
                  <Button onClick={() => setShowRequestModal(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Request Book
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {bookRequests.map((request) => (
                  <div key={request.id} className="border border-secondary-200 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900 mb-1">{request.title}</h4>
                        <p className="text-sm text-secondary-600 mb-1">Author: {request.author}</p>
                        <p className="text-sm text-secondary-600 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-primary-600">Budget: {request.budget}</span>
                          <Badge variant={request.urgency === 'high' ? 'danger' : 'warning'}>{request.urgency}</Badge>
                          <span className="text-secondary-500">{request.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Contact</Button>
                        <Button size="sm">Fulfill</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="text-lg font-display font-bold text-secondary-900 mb-4">Sales Analytics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                    <span className="text-secondary-600">This Month Sales</span>
                    <span className="font-semibold text-secondary-900">₹45,200</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                    <span className="text-secondary-600">Total Books Sold</span>
                    <span className="font-semibold text-secondary-900">156</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                    <span className="text-secondary-600">Average Order Value</span>
                    <span className="font-semibold text-secondary-900">₹290</span>
                  </div>
                  <Button onClick={generateReport} className="w-full">Generate Report</Button>
                </div>
              </Card>
              
              <Card>
                <h3 className="text-lg font-display font-bold text-secondary-900 mb-4">Popular Categories</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Computer Science</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-secondary-200 rounded-full">
                        <div className="w-16 h-2 bg-primary-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-secondary-600">80%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Mathematics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-secondary-200 rounded-full">
                        <div className="w-12 h-2 bg-primary-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-secondary-600">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-600">Physics</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-secondary-200 rounded-full">
                        <div className="w-8 h-2 bg-primary-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-secondary-600">40%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Process Order Modal */}
        {showProcessModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Process Order</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Order ID: #{selectedOrder.id}</p>
                  <p className="font-semibold">{selectedOrder.book}</p>
                  <p className="text-sm">Buyer: {selectedOrder.buyer}</p>
                  <p className="text-sm">Amount: ₹{selectedOrder.amount}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Update Status</label>
                  <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="w-full p-2 border rounded">
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tracking Number (Optional)</label>
                  <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" className="w-full p-2 border rounded" />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowProcessModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button onClick={() => { selectedOrder.status = orderStatus; alert(`Order updated!\nStatus: ${orderStatus}${trackingNumber ? '\nTracking: ' + trackingNumber : ''}`); setShowProcessModal(false); }} className="flex-1">Update Order</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4 h-96 flex flex-col">
              <div className="border-b p-4">
                <h3 className="text-lg font-bold">Chat with {selectedOrder.buyer}</h3>
                <p className="text-sm text-gray-600">Order: {selectedOrder.book}</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs p-3 rounded-lg ${msg.sender === 'buyer' ? 'bg-gray-100' : 'bg-primary-500 text-white'}`}>
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-4">
                <form onSubmit={(e) => { e.preventDefault(); if(chatMessage.trim()) { setChatMessages([...chatMessages, { sender: 'library', text: chatMessage }]); setChatMessage(''); } }} className="flex space-x-2">
                  <input 
                    type="text" 
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 p-2 border rounded" 
                  />
                  <Button type="submit">Send</Button>
                </form>
                <Button onClick={() => setShowChatModal(false)} variant="outline" className="w-full mt-2" size="sm">Close</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Barcode Modal */}
        {showBarcodeModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4 text-center">
              <h3 className="text-xl font-bold mb-4">Barcode - {selectedBook.title}</h3>
              <div className="bg-white p-6 rounded-lg">
                <svg className="mx-auto" width="200" height="80">
                  <rect x="10" y="10" width="3" height="60" fill="black"/>
                  <rect x="16" y="10" width="2" height="60" fill="black"/>
                  <rect x="22" y="10" width="4" height="60" fill="black"/>
                  <rect x="30" y="10" width="2" height="60" fill="black"/>
                  <rect x="36" y="10" width="3" height="60" fill="black"/>
                  <rect x="42" y="10" width="2" height="60" fill="black"/>
                  <rect x="48" y="10" width="4" height="60" fill="black"/>
                  <rect x="56" y="10" width="2" height="60" fill="black"/>
                  <rect x="62" y="10" width="3" height="60" fill="black"/>
                  <rect x="68" y="10" width="2" height="60" fill="black"/>
                  <rect x="74" y="10" width="4" height="60" fill="black"/>
                  <rect x="82" y="10" width="2" height="60" fill="black"/>
                  <rect x="88" y="10" width="3" height="60" fill="black"/>
                  <rect x="94" y="10" width="2" height="60" fill="black"/>
                  <rect x="100" y="10" width="4" height="60" fill="black"/>
                  <rect x="108" y="10" width="2" height="60" fill="black"/>
                  <rect x="114" y="10" width="3" height="60" fill="black"/>
                  <rect x="120" y="10" width="2" height="60" fill="black"/>
                  <rect x="126" y="10" width="4" height="60" fill="black"/>
                  <rect x="134" y="10" width="2" height="60" fill="black"/>
                  <rect x="140" y="10" width="3" height="60" fill="black"/>
                  <rect x="146" y="10" width="2" height="60" fill="black"/>
                  <rect x="152" y="10" width="4" height="60" fill="black"/>
                  <rect x="160" y="10" width="2" height="60" fill="black"/>
                  <rect x="166" y="10" width="3" height="60" fill="black"/>
                  <rect x="172" y="10" width="2" height="60" fill="black"/>
                  <rect x="178" y="10" width="4" height="60" fill="black"/>
                </svg>
                <p className="mt-2 font-mono text-sm">ISBN: {selectedBook.id}00{Math.floor(Math.random() * 10000)}</p>
              </div>
              <div className="flex space-x-2 mt-4">
                <Button onClick={() => setShowBarcodeModal(false)} variant="outline" className="flex-1">Close</Button>
                <Button onClick={() => alert('Barcode downloaded!')} className="flex-1">Download</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Book Modal */}
        {showEditModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Edit Book</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Book updated!'); setShowEditModal(false); }}>
                <input type="text" defaultValue={selectedBook.title} placeholder="Book Title" className="w-full p-2 border rounded" required />
                <input type="text" defaultValue={selectedBook.author} placeholder="Author" className="w-full p-2 border rounded" required />
                <input type="number" defaultValue={selectedBook.price} placeholder="Price" className="w-full p-2 border rounded" required />
                <div className="flex space-x-2">
                  <Button type="button" onClick={() => setShowEditModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Update</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Update Stock Modal */}
        {showStockModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Update Stock - {selectedBook.title}</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Stock updated!'); setShowStockModal(false); }}>
                <input type="number" defaultValue={selectedBook.stock} placeholder="Stock Quantity" className="w-full p-2 border rounded" required />
                <div className="flex space-x-2">
                  <Button type="button" onClick={() => setShowStockModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Update Stock</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Add Book Modal */}
        {showAddBookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Add New Book</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Book Title" className="w-full p-2 border rounded" required />
                <input type="text" placeholder="Author" className="w-full p-2 border rounded" required />
                <input type="number" placeholder="Price" className="w-full p-2 border rounded" required />
                <input type="number" placeholder="Stock" className="w-full p-2 border rounded" required />
                <div className="flex space-x-2">
                  <Button type="button" onClick={() => setShowAddBookModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Add Book</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Messages Modal */}
        {showMessagesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Student Messages & Offers</h3>
                <Button onClick={() => setShowMessagesModal(false)} variant="outline" size="sm">Close</Button>
              </div>
              <div className="space-y-4">
                {libraryMessages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No messages yet</p>
                ) : (
                  libraryMessages.map((msg) => (
                    <div key={msg.id} className={`border rounded-lg p-4 ${!msg.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{msg.type === 'offer' ? '📚 Book Offer' : '💬 Inquiry'}</h4>
                          <p className="text-sm text-gray-600">Book: {msg.bookTitle}</p>
                          <p className="text-sm text-gray-600">From: {msg.studentName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</p>
                          {!msg.read && <Badge variant="primary" size="sm">New</Badge>}
                        </div>
                      </div>
                      
                      {msg.type === 'offer' ? (
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm mb-1"><strong>Offered Price:</strong> ₹{msg.price}</p>
                          <p className="text-sm mb-1"><strong>Condition:</strong> {msg.condition}</p>
                          <p className="text-sm mb-1"><strong>Contact:</strong> {msg.phone}</p>
                        </div>
                      ) : (
                        <div className="bg-white p-3 rounded border">
                          <p className="text-sm mb-1"><strong>Message:</strong> {msg.message}</p>
                          <p className="text-sm mb-1"><strong>Contact:</strong> {msg.phone}</p>
                        </div>
                      )}
                      
                      <div className="flex space-x-2 mt-3">
                        <Button onClick={() => alert(`Calling ${msg.phone}...`)} size="sm">Call Student</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Book Request Modal */}
        {showRequestModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-lg w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Request a Book</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Book request submitted!'); setShowRequestModal(false); }}>
                <input type="text" placeholder="Book Title" className="w-full p-3 border rounded-lg" required />
                <input type="text" placeholder="Author" className="w-full p-3 border rounded-lg" />
                <select className="w-full p-3 border rounded-lg">
                  <option>Select Budget Range</option>
                  <option>₹0 - ₹300</option>
                  <option>₹300 - ₹600</option>
                  <option>₹600+</option>
                </select>
                <textarea placeholder="Description" className="w-full p-3 border rounded-lg h-20"></textarea>
                <div className="flex space-x-3">
                  <Button type="button" onClick={() => setShowRequestModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Submit Request</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Bulk Upload Modal */}
        {showBulkUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Bulk Upload Books</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Upload a CSV file with book details</p>
                <input type="file" accept=".csv" className="w-full p-2 border rounded" />
                <div className="flex space-x-2">
                  <Button onClick={() => setShowBulkUploadModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button className="flex-1">Upload</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};