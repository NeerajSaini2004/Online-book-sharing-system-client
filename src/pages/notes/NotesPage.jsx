import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MagnifyingGlassIcon, 
  DocumentTextIcon,
  StarIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { apiService } from '../../services/api';

export const NotesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notesData, setNotesData] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [buyerEmail, setBuyerEmail] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const response = await apiService.getNotes();
      if (!response.data) return;
      setNotesData(response.data.map(note => ({
        id: note._id,
        title: note.title,
        subject: note.subject,
        class: note.class,
        board: note.board,
        author: note.author?.name || note.author || 'Unknown',
        price: note.price || 0,
        isFree: note.isFree,
        rating: note.rating || 0,
        downloads: note.downloads || 0,
        pages: note.pages,
        type: 'PDF',
        preview: `https://placehold.co/300x400/3b82f6/white?text=${encodeURIComponent(note.subject)}`
      })));
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  const API_BASE = 'https://online-book-sharing-system-backend.onrender.com/api';
  const BACKEND_URL = 'https://online-book-sharing-system-backend.onrender.com';

  const handleDirectDownload = async (note) => {
    try {
      const response = await fetch(`${API_BASE}/notes/download/${note.id}`);
      const data = await response.json();
      
      if (data.downloadUrl) {
        // Fetch the file as blob and download with proper name
        const fileRes = await fetch(data.downloadUrl);
        const blob = await fileRes.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${note.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } else {
        alert(data.message || 'Download failed');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleBuyNotes = (note) => {
    setSelectedNote(note);
    setShowCheckoutModal(true);
  };

  const handleConfirmPurchase = () => {
    if (!buyerEmail.trim()) {
      alert('Please enter your email');
      return;
    }
    
    // Razorpay integration
    const options = {
      key: 'rzp_test_SJTNOuxzzNduur',
      amount: selectedNote.price * 100, // Amount in paise
      currency: 'INR',
      name: 'SmartBook Sharing',
      description: selectedNote.title,
      image: 'https://your-logo-url.com/logo.png',
      handler: function (response) {
        // Payment successful
        const ordersKey = 'myOrders';
        const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
        const newOrder = {
          id: Date.now(),
          title: selectedNote.title,
          seller: selectedNote.author,
          amount: selectedNote.price,
          status: 'delivered',
          orderDate: 'Just now',
          image: selectedNote.preview,
          type: 'notes',
          paymentId: response.razorpay_payment_id
        };
        existingOrders.unshift(newOrder);
        localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
        
        alert(`Payment successful!\nPayment ID: ${response.razorpay_payment_id}\nNotes: ${selectedNote.title}\nDownload link sent to ${buyerEmail}`);
        setShowCheckoutModal(false);
        setBuyerEmail('');
      },
      prefill: {
        email: buyerEmail,
        contact: ''
      },
      theme: {
        color: '#3b82f6'
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.on('payment.failed', function (response) {
      alert('Payment failed: ' + response.error.description);
    });
    razorpay.open();
  };

  const categories = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];

  const filteredNotes = notesData.filter(note => {
    const matchesSearch = searchQuery === '' || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || note.subject === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Digital Notes</h1>
          <p className="text-gray-600 text-sm">Download high-quality study notes</p>
        </div>

        <div className="mb-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search notes..." className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500" />
            </div>
            <Button size="sm" onClick={() => navigate('/notes/upload')}>Upload</Button>
          </div>
        </div>

        {/* Mobile category scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 sm:hidden">
          {categories.map(category => (
            <button key={category} onClick={() => setSelectedCategory(category)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${ selectedCategory === category ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-600'}`}>{category}</button>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden sm:block w-48 flex-shrink-0">
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button key={category} onClick={() => setSelectedCategory(category)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${ selectedCategory === category ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>{category}</button>
                ))}
              </div>
            </Card>
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">Showing {filteredNotes.length} notes</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card hover className="cursor-pointer">
                    <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-4 overflow-hidden">
                      <img 
                        src={note.preview}
                        alt={note.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" size="sm">{note.subject}</Badge>
                        <Badge variant="outline" size="sm">{note.class}</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{note.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">by {note.author}</p>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(note.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">({note.rating})</span>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        {note.isFree ? (
                          <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">FREE</span>
                        ) : (
                          <span className="text-lg font-bold text-primary-600">₹{note.price}</span>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          {note.downloads}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{note.pages} pages</span>
                        <span>{note.type}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => {
                            setSelectedNote(note);
                            setShowPreviewModal(true);
                          }}
                        >
                          <EyeIcon className="h-4 w-4" />
                          Preview
                        </Button>
                        {note.isFree ? (
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleDirectDownload(note)}
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleBuyNotes(note)}
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Buy
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreviewModal && selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="text-xl font-bold">{selectedNote.title}</h3>
                  <p className="text-sm text-gray-600">{selectedNote.subject} - {selectedNote.class}</p>
                </div>
                <button 
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-gray-100 rounded-lg p-8 mb-6">
                  <div className="text-center">
                    <DocumentTextIcon className="h-24 w-24 mx-auto text-primary-500 mb-4" />
                    <h4 className="text-lg font-semibold mb-2">Preview: {selectedNote.title}</h4>
                    <p className="text-gray-600 mb-4">Sample pages from the notes</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Chapter 1: Introduction</h5>
                        <p className="text-gray-700 leading-relaxed">
                          This is a preview of the notes content. The actual notes contain detailed explanations, 
                          diagrams, examples, and practice problems covering all important topics.
                        </p>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Key Topics Covered:</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          <li>Fundamental concepts and definitions</li>
                          <li>Important formulas and theorems</li>
                          <li>Solved examples with step-by-step solutions</li>
                          <li>Practice questions and answers</li>
                          <li>Exam-oriented tips and tricks</li>
                        </ul>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-gray-900 mb-2">Notes Details:</h5>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Pages:</span>
                            <span className="font-medium">{selectedNote.pages}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Format:</span>
                            <span className="font-medium">{selectedNote.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Downloads:</span>
                            <span className="font-medium">{selectedNote.downloads}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rating:</span>
                            <span className="font-medium">{selectedNote.rating} ⭐</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>🔒 Note:</strong> This is a limited preview. Purchase the full notes to access all {selectedNote.pages} pages 
                      with complete content, diagrams, and practice questions.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    {selectedNote.isFree ? (
                      <p className="text-2xl font-bold text-green-600">FREE</p>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-primary-600">₹{selectedNote.price}</p>
                        <p className="text-sm text-gray-600">One-time purchase</p>
                      </>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={() => setShowPreviewModal(false)}>Close Preview</Button>
                    {selectedNote.isFree ? (
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => { setShowPreviewModal(false); handleDirectDownload(selectedNote); }}
                      >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Download Free
                      </Button>
                    ) : (
                      <Button onClick={() => { setShowPreviewModal(false); handleBuyNotes(selectedNote); }}>
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Buy Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckoutModal && selectedNote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Purchase Notes</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-semibold">{selectedNote.title}</p>
                  <p className="text-sm text-gray-600">{selectedNote.subject} - {selectedNote.class}</p>
                  <p className="text-lg font-bold text-primary-600 mt-2">₹{selectedNote.price}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="Enter your email for download link"
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border rounded cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={paymentMethod === 'upi'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>UPI Payment</span>
                    </label>
                    <label className="flex items-center p-3 border rounded cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={() => setShowCheckoutModal(false)} variant="outline" className="flex-1">Cancel</Button>
                  <Button onClick={handleConfirmPurchase} className="flex-1">Confirm Purchase</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};