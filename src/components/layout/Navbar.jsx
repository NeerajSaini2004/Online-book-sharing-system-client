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
    <nav className="bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">BS</span>
            </div>
            <span className="text-lg sm:text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">BookShare</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="text-secondary-600 hover:text-primary-600 font-medium transition-all duration-200 px-2 py-1 rounded-lg hover:bg-primary-50 text-sm">
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex flex-1 max-w-sm mx-6">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <form onSubmit={handleSearch}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..." className="w-full pl-9 pr-4 py-2 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm bg-secondary-50/50" />
              </form>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {user ? (
              <>
                <div className="relative">
                  <button onClick={handleNotifications} className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg relative">
                    <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                      <div className="p-3 border-b flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && <button onClick={markAllAsRead} className="text-xs text-primary-600">Mark all read</button>}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-gray-500 text-sm">No notifications yet</div>
                        ) : (
                          notifications.map((notif) => (
                            <div key={notif.id} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`} onClick={() => markAsRead(notif.id)}>
                              <p className={`text-sm ${notif.unread ? 'font-semibold' : ''}`}>{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="p-2 text-center border-t">
                        <button onClick={() => setShowNotifications(false)} className="text-xs text-primary-600">Close</button>
                      </div>
                    </div>
                  )}
                </div>
                <Link to="/profile" className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                  <UserCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                </Link>
                <span className="hidden sm:block text-sm text-secondary-600 max-w-[80px] truncate">Hi, {user.name}</span>
                <Button onClick={logout} variant="ghost" size="sm" className="hidden sm:block text-xs">Logout</Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
              </div>
            )}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-secondary-600 hover:text-primary-600">
              {isMobileMenuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden border-t border-secondary-200 py-3">
            {/* Mobile search */}
            <div className="px-4 mb-3">
              <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search books..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-sm" />
              </form>
            </div>
            <div className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link key={item.name} to={item.href} className="block text-secondary-600 hover:text-primary-600 font-medium py-2 px-3 rounded-lg hover:bg-primary-50 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                  {item.name}
                </Link>
              ))}
            </div>
            {user && (
              <div className="px-4 pt-3 border-t mt-3">
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="w-full text-left text-sm text-red-500 py-2 px-3 rounded-lg hover:bg-red-50">Logout</button>
              </div>
            )}
            <div className="border-t pt-3 mt-3 px-2">
              {[{to:'/help',label:'Help'},{to:'/contact',label:'Contact'},{to:'/terms',label:'Terms'},{to:'/privacy',label:'Privacy'}].map(l => (
                <Link key={l.to} to={l.to} className="block text-xs text-gray-400 hover:text-primary-600 py-1 px-3" onClick={() => setIsMobileMenuOpen(false)}>{l.label}</Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};