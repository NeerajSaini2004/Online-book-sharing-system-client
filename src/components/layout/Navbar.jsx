import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  MagnifyingGlassIcon, 
  BellIcon, 
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const userRole = user?.role || 'student';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    let allNotifications = [];
    
    if (userRole === 'library') {
      // Load library messages as notifications
      const messages = JSON.parse(localStorage.getItem('libraryMessages') || '[]');
      const messageNotifications = messages.map(msg => ({
        id: `msg-${msg.id}`,
        message: msg.type === 'offer' ? `New book offer for "${msg.bookTitle}"` : `New inquiry for "${msg.bookTitle}"`,
        time: new Date(msg.timestamp).toLocaleString(),
        unread: !msg.read,
        type: 'message',
        data: msg
      }));
      allNotifications = [...allNotifications, ...messageNotifications];
    }
    
    // Add some default notifications
    const defaultNotifications = [
      { id: 'default-1', message: 'Welcome to BookShare!', time: '1 day ago', unread: false, type: 'system' },
      { id: 'default-2', message: 'Your profile is verified', time: '2 days ago', unread: false, type: 'system' }
    ];
    
    allNotifications = [...allNotifications, ...defaultNotifications];
    
    setNotifications(allNotifications);
    setUnreadCount(allNotifications.filter(n => n.unread).length);
  };

  const markAsRead = (notificationId) => {
    if (notificationId.startsWith('msg-')) {
      const msgId = parseInt(notificationId.replace('msg-', ''));
      const messages = JSON.parse(localStorage.getItem('libraryMessages') || '[]');
      const updatedMessages = messages.map(msg => 
        msg.id === msgId ? { ...msg, read: true } : msg
      );
      localStorage.setItem('libraryMessages', JSON.stringify(updatedMessages));
    }
    
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    // Mark all library messages as read
    const messages = JSON.parse(localStorage.getItem('libraryMessages') || '[]');
    const updatedMessages = messages.map(msg => ({ ...msg, read: true }));
    localStorage.setItem('libraryMessages', JSON.stringify(updatedMessages));
    
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    setUnreadCount(0);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };
  
  const handleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const handleChat = () => {
    alert('Opening chat...');
  };

  const navItems = user ? (
    userRole === 'student' 
      ? [
          { name: 'Dashboard', href: '/student/dashboard' },
          { name: 'Browse', href: '/browse' },
          { name: 'Sell', href: '/sell' },
          { name: 'Notes', href: '/notes' },
          { name: 'Blog', href: '/blog' }
        ]
      : [
          { name: 'Dashboard', href: '/library/dashboard' }
        ]
  ) : [
      { name: 'Browse', href: '/browse' },
      { name: 'Blog', href: '/blog' }
    ];

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-large border-b border-secondary-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-large hover:shadow-xl transition-all duration-300 hover:scale-105">
              <span className="text-white font-bold text-lg">BS</span>
            </div>
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent"> BookShare</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-secondary-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-primary-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, notes, or authors..."
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-secondary-50/50 transition-all duration-300 hover:bg-white focus:bg-white"
                />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="relative">
                  <button onClick={handleNotifications} className="p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg relative">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                      <div className="p-4 border-b flex items-center justify-between">
                        <h3 className="font-semibold text-lg">Notifications</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllAsRead} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                            Mark all as read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500">
                            <BellIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                                notif.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                              }`}
                              onClick={() => markAsRead(notif.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className={`text-sm ${notif.unread ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                                    {notif.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                  {notif.type === 'message' && (
                                    <div className="mt-2">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                                        {notif.data?.type === 'offer' ? '💰 Book Offer' : '💬 Inquiry'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                {notif.unread && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-3 text-center border-t bg-gray-50">
                        <button 
                          onClick={() => setShowNotifications(false)} 
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Link to="/profile" className="p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200 hover:bg-primary-50 rounded-lg">
                    <UserCircleIcon className="h-6 w-6" />
                  </Link>
                  <span className="text-sm text-secondary-600">Hi, {user.name}</span>
                  <Button onClick={logout} variant="ghost" size="sm">Logout</Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-secondary-200 py-4 bg-white/95 backdrop-blur-sm"
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-secondary-600 hover:text-primary-600 font-medium transition-colors duration-200 py-2 px-4 rounded-lg hover:bg-primary-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-4 mt-4">
                <Link to="/help" className="block text-sm text-gray-500 hover:text-primary-600 py-1 px-4">Help Center</Link>
                <Link to="/contact" className="block text-sm text-gray-500 hover:text-primary-600 py-1 px-4">Contact Us</Link>
                <Link to="/safety" className="block text-sm text-gray-500 hover:text-primary-600 py-1 px-4">Safety Guidelines</Link>
                <Link to="/disputes" className="block text-sm text-gray-500 hover:text-primary-600 py-1 px-4">Dispute Resolution</Link>
                <Link to="/terms" className="block text-sm text-gray-500 hover:text-primary-600 py-1 px-4">Terms of Service</Link>
                <Link to="/privacy" className="block text-sm text-gray-500 hover:text-primary-600 py-1 px-4">Privacy Policy</Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};