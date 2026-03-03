import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  TruckIcon,
  ShieldCheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Rating } from '../../components/ui/Rating';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

export const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [offerAmount, setOfferAmount] = useState('');
  const [showOfferSuccess, setShowOfferSuccess] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  useEffect(() => {
    fetchBookDetails();
    // Check if book is already in wishlist
    const wishlistKey = 'bookWishlist';
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    const isInWishlist = existingWishlist.some(item => item.id === id);
    setIsWishlisted(isInWishlist);
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/api/listings/${id}`);
      const data = await response.json();
      if (data.success) {
        setBook(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }
    
    if (paymentMethod === 'online') {
      try {
        // Create order from backend
        const response = await fetch('http://localhost:5001/api/payment/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: book.price,
            bookTitle: book.title
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          const options = {
            key: 'rzp_test_SJTNOuxzzNduur', // Your actual key from .env
            amount: data.order.amount,
            currency: data.order.currency,
            name: 'SmartBook Sharing',
            description: book.title,
            order_id: data.order.id,
            handler: async function (response) {
              // Verify payment
              const verifyResponse = await fetch('http://localhost:5001/api/payment/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              
              const verifyData = await verifyResponse.json();
              
              if (verifyData.success) {
                saveOrder();
                alert('Payment successful!');
              } else {
                alert('Payment verification failed!');
              }
            },
            prefill: {
              name: 'User Name',
              email: 'user@example.com',
              contact: '9999999999'
            },
            theme: {
              color: '#3B82F6'
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          alert('Failed to create order: ' + data.message);
        }
      } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
      }
    } else {
      saveOrder();
    }
  };

  const saveOrder = () => {
    const ordersKey = 'myOrders';
    const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
    
    let orderImage = 'https://via.placeholder.com/300x400?text=Book';
    if (bookImages[0] && !bookImages[0].includes('localhost')) {
      orderImage = bookImages[0];
    }
    
    const newOrder = {
      id: Date.now(),
      title: book.title,
      seller: book.seller?.name || 'Seller',
      amount: book.price,
      status: 'shipped',
      orderDate: 'Just now',
      image: orderImage,
      address: deliveryAddress,
      paymentMethod: paymentMethod
    };
    existingOrders.unshift(newOrder);
    localStorage.setItem(ordersKey, JSON.stringify(existingOrders));
    
    alert(`Order placed successfully!\nBook: ${book.title}\nAmount: ₹${book.price}`);
    setShowCheckoutModal(false);
    navigate('/student/dashboard');
  };

  const handleSendOffer = () => {
    if (offerAmount && offerAmount > 0) {
      setShowOfferSuccess(true);
      setTimeout(() => setShowOfferSuccess(false), 3000);
      setOfferAmount('');
    } else {
      alert('Please enter a valid offer amount');
    }
  };

  const handleChatWithSeller = () => {
    navigate('/chat', { state: { sellerId: book.seller?._id, bookId: id, bookTitle: book.title } });
  };

  const handleWishlist = () => {
    const wishlistKey = 'bookWishlist';
    const existingWishlist = JSON.parse(localStorage.getItem(wishlistKey) || '[]');
    
    if (!isWishlisted) {
      // Add to wishlist
      const wishlistItem = {
        id: book._id,
        title: book.title,
        author: book.author,
        currentPrice: book.price,
        targetPrice: Math.floor(book.price * 0.9),
        priceAlert: false,
        image: bookImages[0]
      };
      existingWishlist.push(wishlistItem);
      localStorage.setItem(wishlistKey, JSON.stringify(existingWishlist));
      setIsWishlisted(true);
      alert('Added to wishlist!');
    } else {
      // Remove from wishlist
      const updatedWishlist = existingWishlist.filter(item => item.id !== book._id);
      localStorage.setItem(wishlistKey, JSON.stringify(updatedWishlist));
      setIsWishlisted(false);
      alert('Removed from wishlist!');
    }
  };

  const reviews = [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }

  const bookImages = book.images?.map(img => `http://localhost:5001${img.url}`) || ['https://via.placeholder.com/300x400'];



  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden">
              <img
                src={bookImages[selectedImage]}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {bookImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-24 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-primary-500' : 'border-gray-200'
                    }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-display font-bold text-secondary-900">{book.title}</h1>
                <button
                  onClick={handleWishlist}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartSolidIcon className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              <p className="text-xl text-secondary-600 mb-2">by {book.author}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {book.isbn && <><span>ISBN: {book.isbn}</span><span>•</span></>}
                <Badge variant="secondary" className="capitalize">{book.condition}</Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-primary-600">₹{book.price}</div>
              {book.originalPrice && (
                <>
                  <div className="text-lg text-gray-500 line-through">₹{book.originalPrice}</div>
                  <Badge variant="success">
                    {Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Seller Info */}
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{book.seller?.name || 'Seller'}</span>
                      <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Verified Seller</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {book.location?.city || 'Location'}
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleBuyNow} className="w-full" size="lg">
                Buy Now
              </Button>

              <Button onClick={handleChatWithSeller} variant="outline" className="w-full">
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Chat with Seller
              </Button>

              {showOfferSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  Offer sent successfully!
                </div>
              )}
            </div>

            {/* Delivery Options */}
            <div className="space-y-2">
              <h3 className="font-semibold text-secondary-900">Delivery Options</h3>
              <div className="flex space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  Local Pickup
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <TruckIcon className="h-4 w-4 mr-1" />
                  Home Delivery
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description and Reviews */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{book.description}</p>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
              <div className="text-center py-8 text-gray-500">
                No reviews yet
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Book Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium capitalize">{book.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Condition:</span>
                  <span className="font-medium capitalize">{book.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium capitalize">{book.status}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Checkout</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="font-semibold">{book.title}</p>
                <p className="text-sm text-gray-600">by {book.author}</p>
                <p className="text-lg font-bold text-primary-600 mt-2">₹{book.price}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your complete address"
                  className="w-full p-2 border rounded"
                  rows="3"
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
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                  <label className="flex items-center p-3 border rounded cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span>Online Payment</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={() => setShowCheckoutModal(false)} variant="outline" className="flex-1">Cancel</Button>
                <Button onClick={handleConfirmOrder} className="flex-1">Confirm Order</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};