import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  Squares2X2Icon, 
  ListBulletIcon,
  MapPinIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { categories, conditions, classes, boards, locations } from '../../data/books';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://online-book-sharing-system-backend.onrender.com';
const FALLBACK_IMG = 'https://placehold.co/300x400/e2e8f0/64748b?text=No+Image';

const getImageUrl = (images) => {
  if (!images || images.length === 0) return FALLBACK_IMG;
  const url = images[0]?.url;
  if (!url) return FALLBACK_IMG;
  if (url.startsWith('http')) return url;
  return `${API_BASE}${url}`;
};

export const SearchPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    condition: 'All Conditions',
    class: 'All Classes',
    board: 'All Boards',
  });

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getListings();
      setListings(response.data || []);
    } catch (error) {
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

    const matchesCategory = filters.category === 'All Categories' ||
      book.category?.toLowerCase() === filters.category.toLowerCase();

    const matchesCondition = filters.condition === 'All Conditions' ||
      book.condition?.toLowerCase() === filters.condition.toLowerCase();

    const matchesClass = filters.class === 'All Classes' ||
      book.class === filters.class;

    const matchesBoard = filters.board === 'All Boards' ||
      book.board === filters.board;

    return matchesSearch && matchesCategory && matchesCondition && matchesClass && matchesBoard;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      case 'rating': return (b.rating?.average || 0) - (a.rating?.average || 0);
      default: return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const clearFilters = () => {
    setFilters({ category: 'All Categories', condition: 'All Conditions', class: 'All Classes', board: 'All Boards' });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(v => !v.startsWith('All')).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-3 py-3">
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors..."
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XMarkIcon className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-600' : 'border-gray-300 text-gray-600'}`}
            >
              <FunnelIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <div className="hidden sm:flex border border-gray-300 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-500'}`}>
                <Squares2X2Icon className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-500'}`}>
                <ListBulletIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-screen-xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <Card className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                    <select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm">
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Condition</label>
                    <select value={filters.condition} onChange={(e) => setFilters({...filters, condition: e.target.value})} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm">
                      {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Class</label>
                    <select value={filters.class} onChange={(e) => setFilters({...filters, class: e.target.value})} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm">
                      {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Board</label>
                    <select value={filters.board} onChange={(e) => setFilters({...filters, board: e.target.value})} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm">
                      {boards.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium">
                    Clear all filters
                  </button>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {loading ? 'Loading...' : `${filteredBooks.length} books found`}
          </p>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {/* Books Grid/List */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Card key={idx} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-4xl mb-3">📚</p>
            <p className="text-gray-600 font-medium">No books found</p>
            <p className="text-gray-400 text-sm mt-1">Try changing your search or filters</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-3 text-primary-600 text-sm font-medium">Clear filters</button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredBooks.map((book) => (
              <motion.div key={book._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card hover className="cursor-pointer h-full" onClick={() => navigate(`/book/${book._id}`)}>
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl mb-3 overflow-hidden">
                    <img
                      src={getImageUrl(book.images)}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = FALLBACK_IMG; }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-2">{book.title}</h3>
                  <p className="text-gray-500 text-xs mb-2 truncate">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-primary-600">₹{book.price}</span>
                    <Badge variant="secondary" className="text-xs capitalize">{book.condition}</Badge>
                  </div>
                  {book.location?.city && (
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <MapPinIcon className="h-3 w-3 mr-0.5" />
                      {book.location.city}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBooks.map((book) => (
              <motion.div key={book._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card hover className="cursor-pointer" onClick={() => navigate(`/book/${book._id}`)}>
                  <div className="flex gap-3 sm:gap-4">
                    <div className="w-16 h-20 sm:w-20 sm:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={getImageUrl(book.images)} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{book.title}</h3>
                      <p className="text-gray-500 text-xs sm:text-sm">{book.author}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs capitalize">{book.condition}</Badge>
                        {book.category && <Badge variant="outline" className="text-xs capitalize">{book.category}</Badge>}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-bold text-primary-600">₹{book.price}</span>
                        {book.location?.city && (
                          <div className="flex items-center text-xs text-gray-400">
                            <MapPinIcon className="h-3 w-3 mr-0.5" />
                            {book.location.city}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
