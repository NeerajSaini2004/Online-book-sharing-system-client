import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  MagnifyingGlassIcon,
  BookOpenIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

export const LandingPage = () => {
  const { user } = useAuth();
  const categories = [
    'UPSC', 'GATE', 'NEET', 'JEE', 'Engineering', 'Medical', 'Law', 'MBA'
  ];

  const features = [
    {
      icon: BookOpenIcon,
      title: 'Vast Collection',
      description: 'Access thousands of textbooks, notes, and study materials from KYC-verified sellers'
    },
    {
      icon: UserGroupIcon,
      title: 'Verified Community',
      description: 'All sellers undergo KYC verification. Connect with trusted students and libraries'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Escrow Protection',
      description: 'Secure escrow system holds payments until you confirm receipt of books'
    }
  ];

  const trendingBooks = [
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', price: '₹450', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f' },
    { title: 'Physics for Engineers', author: 'Halliday & Resnick', price: '₹350', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba' },
    { title: 'Mathematics for ML', author: 'Marc Peter Deisenroth', price: '₹500', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794' },
    { title: 'Database System Concepts', author: 'Silberschatz', price: '₹400', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d' }
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-accent-400/20 rounded-full blur-xl animate-pulse-soft"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-300/10 rounded-full blur-2xl animate-bounce-soft"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight relative z-10">
                <span className="bg-gradient-to-r from-white to-accent-200 bg-clip-text text-transparent">OnlineBook</span>
                <span className="block bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">Sharing</span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed relative z-10">
                India's premier marketplace for second-hand books and academic materials. 
                Connect with verified students and libraries for secure transactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <Link to="/browse">
                  <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-primary-900 font-semibold shadow-large border-0">
                    Start Browsing
                    <ArrowRightIcon className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/sell">
                  <Button size="lg" variant="outline" className="border-2 border-accent-300 text-accent-300 hover:bg-accent-300 hover:text-primary-900 font-semibold">
                    Sell Your Books
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for books, notes, or authors..."
                    onKeyPress={(e) => e.key === 'Enter' && e.target.value && (window.location.href = `/browse?search=${encodeURIComponent(e.target.value)}`)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 text-lg focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                  />
                </div>
                <div className="mt-6">
                  <p className="text-blue-100 mb-3">Popular categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 4).map((category) => (
                      <span
                        key={category}
                        onClick={() => window.location.href = `/browse?category=${category}`}
                        className="px-3 py-1 bg-white/20 rounded-full text-sm hover:bg-white/30 cursor-pointer transition-colors"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-white via-primary-50/30 to-secondary-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-pulse-soft"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-200/15 rounded-full blur-3xl animate-bounce-soft"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                🏆 India's #1 Choice
              </span>
              <h2 className="text-5xl lg:text-6xl font-display font-bold bg-gradient-to-r from-primary-800 via-primary-600 to-primary-700 bg-clip-text text-transparent mb-6">
                Why Choose BookShare?
              </h2>
              <p className="text-xl text-secondary-600 max-w-4xl mx-auto leading-relaxed">
                India's most trusted platform for buying and selling academic materials with 
                <span className="font-semibold text-primary-600"> KYC verification</span> and 
                <span className="font-semibold text-primary-600"> escrow protection</span>
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: index * 0.2 }}
                  className="group"
                >
                  <Card className="text-center h-full p-8 bg-white/80 backdrop-blur-sm border-0 shadow-soft hover:shadow-large transition-all duration-300 group-hover:scale-105">
                    <div className="relative mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl flex items-center justify-center mx-auto shadow-medium group-hover:shadow-large transition-all duration-300">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-400 rounded-full animate-ping opacity-75"></div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-secondary-600 leading-relaxed text-lg mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center justify-center space-x-1 text-accent-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm font-medium ml-2">Trusted by 10,000+ users</span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h3 className="text-2xl font-bold mb-2">🚀 Join 10,000+ Happy Users</h3>
                  <p className="text-primary-100">Start your secure book trading journey today</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/signup">
                    <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-primary-900 font-semibold">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/browse">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-700">
                      Browse Books
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-secondary-900 mb-2">Trending Books</h2>
              <p className="text-secondary-600">Most popular books this week</p>
            </div>
            <Link to="/browse">
              <Button variant="outline">
                View All
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trendingBooks.map((book, index) => (
              <motion.div
                key={book.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="group cursor-pointer" onClick={() => window.location.href = '/book/1'}>
                  <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4 overflow-hidden">
                    <img 
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-2">{book.author}</p>
                  <p className="text-lg font-bold text-primary-600">{book.price}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {!user && (
        <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-4xl font-display font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of students and libraries already using SmartBook Sharing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-primary-900 font-semibold shadow-large border-0">
                  Create Account
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="border-2 border-accent-300 text-accent-300 hover:bg-accent-300 hover:text-primary-900 font-semibold">
                  Browse Books
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};