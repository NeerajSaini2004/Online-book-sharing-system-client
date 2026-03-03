import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  MapPinIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { categories, conditions, classes, boards, locations } from '../../data/books';
import { apiService } from '../../services/api';

export const SearchPage = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    condition: 'All Conditions',
    class: 'All Classes',
    board: 'All Boards',
    location: 'All Locations'
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getListings();
      setListings(response.data || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = listings.filter(book => {
    const matchesSearch = searchQuery === '' || 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchQuery));
    
    return matchesSearch &&
      (filters.category === 'All Categories' || book.category === filters.category.toLowerCase()) &&
      (filters.condition === 'All Conditions' || book.condition === filters.condition.toLowerCase());
  }).sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      default: return 0;
    }
  });

  const clearFilters = () => {
    setFilters({
      category: 'All Categories',
      condition: 'All Conditions',
      class: 'All Classes',
      board: 'All Boards',
      location: 'All Locations'
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, ISBN..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
              </Button>
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-600'}`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 flex-shrink-0"
            >
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <select 
                      value={filters.category}
                      onChange={(e) => setFilters({...filters, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Condition</h4>
                    <select 
                      value={filters.condition}
                      onChange={(e) => setFilters({...filters, condition: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                    >
                      {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Class</h4>
                    <select 
                      value={filters.class}
                      onChange={(e) => setFilters({...filters, class: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                    >
                      {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Board</h4>
                    <select 
                      value={filters.board}
                      onChange={(e) => setFilters({...filters, board: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                    >
                      {boards.map(board => <option key={board} value={board}>{board}</option>)}
                    </select>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <select 
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
                    >
                      {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Seller Type</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Students</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Libraries</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        <span className="ml-2 text-sm text-gray-700">Verified Sellers Only</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Price Range</h4>
                    <div className="space-y-2">
                      <input 
                        type="range" 
                        min="0" 
                        max="2000" 
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹0</span>
                        <span>₹2000+</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1">Clear</Button>
                    <Button onClick={() => alert('Filters applied!')} className="flex-1">Apply</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Showing ${filteredBooks.length} results`}
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
                <option value="location">Nearest First</option>
                <option value="seller-type">Libraries First</option>
              </select>
            </div>

            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </Card>
                ))
              ) : filteredBooks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No books found matching your criteria</p>
                </div>
              ) : (
                filteredBooks.map((book) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card hover className="cursor-pointer" onClick={() => window.location.href = `/book/${book._id}`}>
                      <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4 overflow-hidden">
                        {book.images && book.images.length > 0 ? (
                          <img 
                            src={`http://localhost:5001${book.images[0].url}`}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center text-gray-400" style={{display: book.images && book.images.length > 0 ? 'none' : 'flex'}}>
                          No Image
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="capitalize">{book.condition}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary-600">₹{book.price}</span>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {book.location?.city || 'Location'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};