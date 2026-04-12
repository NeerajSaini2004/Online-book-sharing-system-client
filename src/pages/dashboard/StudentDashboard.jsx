import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpenIcon,
  CurrencyRupeeIcon,
  EyeIcon,
  HeartIcon,
  ShoppingBagIcon,
  ClockIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'https://online-book-sharing-system-backend.onrender.com';
const FALLBACK_IMG = 'https://placehold.co/300x400/e2e8f0/64748b?text=No+Image';
const getImageUrl = (images) => {
  const url = images?.[0]?.url;
  if (!url) return FALLBACK_IMG;
  return url.startsWith('http') ? url : `${API_BASE}${url}`;
};

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [myListings, setMyListings] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [orderFilter, setOrderFilter] = useState('all');
  const [wishlist, setWishlist] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [inbox, setInbox] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    loadMyListings();
    loadWishlist();
    loadOrders();
    loadInbox();
  }, []);

  const loadInbox = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('https://online-book-sharing-system-backend.onrender.com/api/users/inbox', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setInbox(data.data);
    } catch {}
  };

  const markRead = async (msgId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://online-book-sharing-system-backend.onrender.com/api/users/inbox/${msgId}/read`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}` }
      });
      setInbox(prev => prev.map(m => m._id === msgId ? { ...m, read: true } : m));
    } catch {}
  };

  const loadWishlist = async () => {
    try {
      const response = await apiService.getWishlist();
      if (response.success) {
        const mapped = response.data.map(w => ({
          id: w.listing?._id || w._id,
          title: w.listing?.title || 'Unknown',
          author: w.listing?.author || '',
          currentPrice: w.listing?.price || 0,
          targetPrice: w.listing?.price || 0,
          image: w.listing?.images?.[0]?.url
            ? `https://online-book-sharing-system-backend.onrender.com${w.listing.images[0].url}`
            : null
        }));
        setWishlist(mapped);
      }
    } catch {
      const saved = JSON.parse(localStorage.getItem('bookWishlist') || '[]');
      setWishlist(saved);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await apiService.getMyOrders();
      if (response.success) {
        const mapped = response.data.map(o => ({
          id: o._id,
          title: o.bookTitle || o.listing?.title || 'Unknown Book',
          seller: o.sellerName || o.seller?.name || 'Unknown Seller',
          amount: o.amount || o.totalAmount || 0,
          status: o.deliveryStatus || o.status || 'Pending',
          orderDate: new Date(o.createdAt).toLocaleDateString(),
          trackingId: o.trackingId || '',
          image: o.bookImage || (o.listing?.images?.[0]?.url
            ? `https://online-book-sharing-system-backend.onrender.com${o.listing.images[0].url}`
            : null)
        }));
        setMyOrders(mapped);
      }
    } catch (error) {
      const saved = JSON.parse(localStorage.getItem('myOrders') || '[]');
      setMyOrders(saved);
    }
  };

  const loadMyListings = async () => {
    try {
      const response = await apiService.getMyListings();
      if (response.success) {
        setMyListings(response.data);
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  const stats = [
    { label: 'Books Sold', value: myListings.filter(l => l.status === 'sold').length.toString(), icon: BookOpenIcon, color: 'text-green-600' },
    { label: 'Total Earnings', value: '₹' + myListings.filter(l => l.status === 'sold').reduce((sum, l) => sum + (l.price || 0), 0).toLocaleString(), icon: CurrencyRupeeIcon, color: 'text-blue-600' },
    { label: 'Active Listings', value: myListings.filter(l => l.status === 'active').length.toString(), icon: EyeIcon, color: 'text-purple-600' },
    { label: 'Wishlist Items', value: wishlist.length.toString(), icon: HeartIcon, color: 'text-red-600' }
  ];

  const recentOrders = myOrders;

  const removeFromWishlist = async (itemId) => {
    if (window.confirm('Remove this book from wishlist?')) {
      try {
        await apiService.removeFromWishlist(itemId);
      } catch {}
      setWishlist(wishlist.filter(item => item.id !== itemId));
    }
  };

  const buyNow = (item) => {
    navigate(`/book/${item.id}`);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'listings', label: 'My Listings' },
    { id: 'orders', label: 'My Orders' },
    { id: 'inbox', label: `Inbox${inbox.filter(m => !m.read).length > 0 ? ` (${inbox.filter(m => !m.read).length})` : ''}` },
    { id: 'wishlist', label: 'Wishlist' }
  ];

  const filteredOrders = orderFilter === 'all' 
    ? recentOrders 
    : recentOrders.filter(order => order.status === orderFilter);

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

  const wishlistItems = wishlist;

  const exportOrders = () => {
    const csv = ['Title,Seller,Amount,Status,Date\n'];
    recentOrders.forEach(order => {
      csv.push(`"${order.title}","${order.seller}",${order.amount},${order.status},"${order.orderDate}"\n`);
    });
    const blob = new Blob(csv, { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">Welcome, {user?.name || 'Student'} 👋</h1>
          <p className="text-secondary-600">Manage your books and track your activity</p>
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
                  <h3 className="text-lg font-display font-bold text-secondary-900">Recent Listings</h3>
                  <Button onClick={() => setActiveTab('listings')} variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {myListings.slice(0, 2).map((listing) => (
                    <div key={listing._id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg shadow-soft">
                      <div className="w-12 h-16 bg-secondary-200 rounded overflow-hidden flex-shrink-0">
                        <img src={getImageUrl(listing.images)} alt={listing.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">{listing.title}</h4>
                        <p className="text-sm text-secondary-600">{listing.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">₹{listing.price}</p>
                        <Badge variant={listing.status === 'sold' ? 'success' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {myListings.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No listings yet</p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-display font-bold text-secondary-900">Recent Orders</h3>
                  <Button onClick={() => setActiveTab('orders')} variant="outline" size="sm">View All</Button>
                </div>
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg shadow-soft">
                      <div className="w-12 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold">
                        {order.image && order.image.startsWith('http') && !order.image.includes('placeholder') ? (
                          <img src={order.image} alt={order.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = order.title.charAt(0).toUpperCase(); }} />
                        ) : (
                          order.title.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">{order.title}</h4>
                        <p className="text-sm text-secondary-600">by {order.seller}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-secondary-900">₹{order.amount}</p>
                        <Badge variant={order.status === 'delivered' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'listings' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">My Listings</h3>
                <Button onClick={() => navigate('/sell')}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add New Listing
                </Button>
              </div>
              <div className="space-y-4">
                {myListings.map((listing) => (
                  <div key={listing._id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200">
                    <div className="w-16 h-20 bg-secondary-200 rounded overflow-hidden flex-shrink-0">
                      <img src={getImageUrl(listing.images)} alt={listing.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900">{listing.title}</h4>
                      <p className="text-sm text-secondary-600 mb-2">{listing.author}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-secondary-600">Price: ₹{listing.price}</span>
                        <span className="text-secondary-600">Views: {listing.views || 0}</span>
                        <Badge variant={listing.status === 'sold' ? 'success' : 'secondary'}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => { setSelectedItem(listing); setShowEditModal(true); }} variant="outline" size="sm">Edit</Button>
                      <Button onClick={async () => { if (confirm('Delete this listing?')) { await apiService.deleteListing(listing._id); loadMyListings(); } }} variant="outline" size="sm">Delete</Button>
                    </div>
                  </div>
                ))}
                {myListings.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No listings yet</p>
                    <Button onClick={() => navigate('/sell')}>Create Your First Listing</Button>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">My Orders</h3>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowFilterModal(true)} variant="outline" size="sm">Filter</Button>
                  <Button onClick={exportOrders} variant="outline" size="sm">Export</Button>
                </div>
              </div>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200">
                    <div className="w-16 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                      {order.image && order.image.startsWith('http') && !order.image.includes('placeholder') ? (
                        <img src={order.image} alt={order.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = order.title.charAt(0).toUpperCase(); }} />
                      ) : (
                        order.title.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-secondary-900">{order.title}</h4>
                      <p className="text-sm text-secondary-600 mb-2">Seller: {order.seller}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-secondary-600">Amount: ₹{order.amount}</span>
                        <span className="text-secondary-600">{order.orderDate}</span>
                        <Badge variant={order.status === 'delivered' ? 'success' : 'warning'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => { setSelectedItem(order); setShowTrackModal(true); }} variant="outline" size="sm">Track</Button>
                      <Button onClick={() => { setSelectedItem(order); setChatMessages([]); setShowChatModal(true); }} variant="outline" size="sm">Chat</Button>
                      {order.status === 'delivered' && (
                        <Button onClick={() => { setSelectedItem(order); setRating(0); setShowReviewModal(true); }} size="sm">Review</Button>
                      )}
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
                <p className="text-sm text-secondary-600">Help fulfill library requests and earn money</p>
              </div>
              <div className="space-y-4">
                {bookRequests.map((request) => (
                  <div key={request.id} className="border border-secondary-200 rounded-xl p-4 hover:shadow-medium transition-all duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-secondary-900">{request.title}</h4>
                          <Badge variant={request.urgency === 'high' ? 'danger' : request.urgency === 'medium' ? 'warning' : 'default'}>
                            {request.urgency} priority
                          </Badge>
                          <Badge variant={request.status === 'fulfilled' ? 'success' : 'default'}>
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-secondary-600 mb-1">Author: {request.author}</p>
                        <p className="text-sm text-secondary-600 mb-1">Requested by: {request.requestedBy}</p>
                        <p className="text-sm text-secondary-600 mb-2">{request.description}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-primary-600 font-medium">Budget: {request.budget}</span>
                          <span className="text-secondary-500">{request.date}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {request.status === 'open' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowContactModal(true);
                              }}
                            >
                              Contact Library
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedRequest(request);
                                setShowOfferModal(true);
                              }}
                            >
                              I Have This Book
                            </Button>
                          </>
                        )}
                        {request.status === 'fulfilled' && (
                          <Button variant="outline" size="sm" disabled>Already Fulfilled</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-primary-50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary-800 mb-2">💰 Earn Money by Fulfilling Requests</h4>
                <p className="text-sm text-primary-700">
                  Libraries post book requests with their budget. If you have the requested book, 
                  contact them to make a sale. It's a great way to sell books that are in demand!
                </p>
              </div>
            </Card>
          )}

          {activeTab === 'inbox' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">Inbox</h3>
                <p className="text-sm text-gray-500">{inbox.filter(m => !m.read).length} unread</p>
              </div>
              {inbox.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">📬</p>
                  <p className="text-gray-500">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Messages from buyers will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inbox.map((msg) => (
                    <div key={msg._id} className={`rounded-xl border transition-colors ${ !msg.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="p-4 cursor-pointer" onClick={() => { markRead(msg._id); setReplyTo(replyTo?._id === msg._id ? null : msg); setReplyText(''); }}>
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600">
                              {msg.fromName?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{msg.fromName || 'Buyer'}</p>
                              <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!msg.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                            <span className="text-xs text-primary-600">{replyTo?._id === msg._id ? 'Close ▲' : 'Reply ▼'}</span>
                          </div>
                        </div>
                        {msg.bookTitle && <p className="text-xs text-primary-600 mb-1">📚 {msg.bookTitle}</p>}
                        <p className="text-sm text-gray-700">{msg.message}</p>
                      </div>

                      {replyTo?._id === msg._id && (
                        <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                          <p className="text-xs text-gray-500 mb-2">Reply to {msg.fromName} — your reply will go to their inbox</p>
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={3}
                            placeholder="Type your reply..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 resize-none"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => { setReplyTo(null); setReplyText(''); }}>Cancel</Button>
                            <Button size="sm" onClick={async () => {
                              if (!replyText.trim()) return;
                              try {
                                const token = localStorage.getItem('token');
                                const res = await fetch('https://online-book-sharing-system-backend.onrender.com/api/users/message', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                                  body: JSON.stringify({
                                    sellerId: msg.from?._id || msg.from,
                                    bookId: msg.bookId,
                                    bookTitle: msg.bookTitle,
                                    message: replyText.trim()
                                  })
                                });
                                const data = await res.json();
                                if (data.success) {
                                  alert('✅ Reply sent!');
                                  setReplyTo(null);
                                  setReplyText('');
                                }
                              } catch { alert('Failed to send reply'); }
                            }}>Send Reply</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'wishlist' && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-secondary-900">My Wishlist</h3>
                <p className="text-sm text-secondary-600">{wishlistItems.length} items</p>
              </div>
              {wishlistItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">Your wishlist is empty</p>
                  <p className="text-sm text-gray-400 mb-4">Browse books and add them to your wishlist</p>
                  <Button onClick={() => navigate('/browse')}>Browse Books</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-secondary-200 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200">
                      <div className="w-16 h-20 bg-secondary-200 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-secondary-900">{item.title}</h4>
                        <p className="text-sm text-secondary-600 mb-2">{item.author}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="text-secondary-600">Current: ₹{item.currentPrice}</span>
                          <span className="text-primary-600">Target: ₹{item.targetPrice}</span>
                          {item.priceAlert && (
                            <Badge variant="success" size="sm">Price Alert On</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={() => removeFromWishlist(item.id)} variant="outline" size="sm">Remove</Button>
                        <Button onClick={() => buyNow(item)} size="sm">Buy Now</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Contact Library Modal */}
        {showContactModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-lg w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Contact {selectedRequest.requestedBy}</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold">{selectedRequest.title}</h4>
                <p className="text-sm text-gray-600">Author: {selectedRequest.author}</p>
                <p className="text-sm text-gray-600">Budget: {selectedRequest.budget}</p>
              </div>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const message = formData.get('message');
                const phone = formData.get('phone');
                
                // Save message to localStorage for library to see
                const messages = JSON.parse(localStorage.getItem('libraryMessages') || '[]');
                const newMessage = {
                  id: Date.now(),
                  type: 'inquiry',
                  requestId: selectedRequest.id,
                  bookTitle: selectedRequest.title,
                  studentName: 'Current Student',
                  message: message,
                  phone: phone,
                  timestamp: new Date().toISOString(),
                  read: false
                };
                messages.push(newMessage);
                localStorage.setItem('libraryMessages', JSON.stringify(messages));
                
                alert(`Message sent to ${selectedRequest.requestedBy}!`);
                setShowContactModal(false);
              }}>
                <textarea 
                  name="message"
                  placeholder="Hi, I saw your request for this book. I might be able to help you."
                  className="w-full p-3 border rounded-lg h-24"
                  required
                ></textarea>
                <input name="phone" type="tel" placeholder="Your phone number" className="w-full p-3 border rounded-lg" required />
                <div className="flex space-x-3">
                  <Button type="button" onClick={() => setShowContactModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Send Message</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* I Have This Book Modal */}
        {showOfferModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-lg w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Offer Your Book</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold">{selectedRequest.title}</h4>
                <p className="text-sm text-primary-600">Budget: {selectedRequest.budget}</p>
              </div>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const price = formData.get('price');
                const condition = formData.get('condition');
                const phone = formData.get('phone');
                
                // Save offer to localStorage for library to see
                const messages = JSON.parse(localStorage.getItem('libraryMessages') || '[]');
                const newOffer = {
                  id: Date.now(),
                  type: 'offer',
                  requestId: selectedRequest.id,
                  bookTitle: selectedRequest.title,
                  studentName: 'Current Student',
                  price: price,
                  condition: condition,
                  phone: phone,
                  timestamp: new Date().toISOString(),
                  read: false
                };
                messages.push(newOffer);
                localStorage.setItem('libraryMessages', JSON.stringify(messages));
                
                alert('Offer submitted! Library will contact you.');
                setShowOfferModal(false);
              }}>
                <input name="price" type="number" placeholder="Your selling price" className="w-full p-3 border rounded-lg" required />
                <select name="condition" className="w-full p-3 border rounded-lg" required>
                  <option value="">Book condition</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
                <input name="phone" type="tel" placeholder="Your contact number" className="w-full p-3 border rounded-lg" required />
                <div className="flex space-x-3">
                  <Button type="button" onClick={() => setShowOfferModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Submit Offer</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {/* Edit Listing Modal */}
        {showEditModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Edit Listing</h3>
              <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); const formData = new FormData(e.target); await apiService.updateListing(selectedItem._id, { title: formData.get('title'), author: formData.get('author'), price: formData.get('price') }); setShowEditModal(false); loadMyListings(); }}>
                <input type="text" name="title" defaultValue={selectedItem.title} placeholder="Book Title" className="w-full p-2 border rounded" required />
                <input type="text" name="author" defaultValue={selectedItem.author} placeholder="Author" className="w-full p-2 border rounded" required />
                <input type="number" name="price" defaultValue={selectedItem.price} placeholder="Price" className="w-full p-2 border rounded" required />
                <div className="flex space-x-2">
                  <Button type="button" onClick={() => setShowEditModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Update</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {showTrackModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Track Order</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold">{selectedItem.title}</p>
                  <p className="text-sm text-gray-600">Seller: {selectedItem.seller}</p>
                  <p className="text-sm text-gray-600">Amount: ₹{selectedItem.amount}</p>
                  {selectedItem.trackingId && <p className="text-sm text-blue-600 mt-1">Tracking ID: {selectedItem.trackingId}</p>}
                </div>
                <div className="space-y-3">
                  {['Pending', 'Shipped', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                    const statusOrder = ['Pending', 'Shipped', 'Out for Delivery', 'Delivered'];
                    const currentIdx = statusOrder.indexOf(selectedItem.status);
                    const isDone = idx <= currentIdx;
                    return (
                      <div key={step} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${isDone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <div>
                          <p className={`text-sm font-medium ${isDone ? 'text-green-700' : 'text-gray-400'}`}>{step}</p>
                          {idx === currentIdx && <p className="text-xs text-gray-500">Current Status</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button onClick={() => setShowTrackModal(false)} className="w-full">Close</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Chat Modal */}
        {showChatModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md flex flex-col" style={{height: '480px'}}>
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-bold">Chat with {selectedItem.seller}</h3>
                <button onClick={() => setShowChatModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 && (
                  <p className="text-center text-gray-400 text-sm mt-8">Start a conversation</p>
                )}
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.sender === 'me' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t p-3">
                <form onSubmit={(e) => { e.preventDefault(); const input = e.target.elements.msg; if(input.value.trim()) { setChatMessages([...chatMessages, { sender: 'me', text: input.value }]); input.value = ''; }}} className="flex gap-2">
                  <input name="msg" type="text" placeholder="Type a message..." className="flex-1 p-2 border rounded-lg text-sm" />
                  <Button type="submit" size="sm">Send</Button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Filter Modal */}
        {showFilterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-sm w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Filter Orders</h3>
              <div className="space-y-3">
                {['all', 'delivered', 'shipped'].map(status => (
                  <button
                    key={status}
                    onClick={() => { setOrderFilter(status); setShowFilterModal(false); }}
                    className={`w-full p-3 text-left rounded-lg border ${
                      orderFilter === status 
                        ? 'border-primary-500 bg-primary-50 text-primary-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
              <Button onClick={() => setShowFilterModal(false)} variant="outline" className="w-full mt-4">Close</Button>
            </Card>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-4">Write Review</h3>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert(`Review submitted with ${rating} stars!`); setShowReviewModal(false); }}>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold">{selectedItem.title}</p>
                  <p className="text-sm text-gray-600">Seller: {selectedItem.seller}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex space-x-2">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setRating(star)} className="text-2xl">
                        {star <= rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea placeholder="Write your review..." className="w-full p-2 border rounded" rows="4" required></textarea>
                <div className="flex space-x-2">
                  <Button type="button" onClick={() => setShowReviewModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1">Submit Review</Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};