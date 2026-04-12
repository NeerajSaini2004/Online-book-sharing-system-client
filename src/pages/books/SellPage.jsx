import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const engineeringCategories = [
  'Computer Science Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Electrical Engineering', 'Electronics & Communication', 'Chemical Engineering',
  'Aerospace Engineering', 'Biotechnology', 'Information Technology', 'Data Science'
];

const generalCategories = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'English', 'History', 'Geography', 'Economics', 'Commerce', 'Medical', 'Other'
];

const conditions = ['Like New', 'Good', 'Fair', 'Poor'];
const classList = ['9th', '10th', '11th', '12th', 'Engineering', 'Graduation', 'Other'];

export const SellPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    originalPrice: '',
    condition: 'Good',
    category: '',
    class: '12th',
    description: '',
    images: [],
    imageFiles: []
  });

  const getCategories = () => formData.class === 'Engineering' ? engineeringCategories : generalCategories;

  const handleClassChange = (val) => {
    setFormData({ ...formData, class: val, category: '' });
  };
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormData({ 
      ...formData, 
      images: [...formData.images, ...newImages],
      imageFiles: [...formData.imageFiles, ...files]
    });
  };

  const removeImage = (index) => {
    setFormData({ 
      ...formData, 
      images: formData.images.filter((_, i) => i !== index),
      imageFiles: formData.imageFiles.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      alert('Please accept the Terms & Conditions');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        condition: formData.condition,
        category: formData.category,
        class: formData.class,
        description: formData.description || 'No description provided',
        status: 'active'
      };
      
      if (formData.imageFiles.length > 0) {
        submitData.bookImage = formData.imageFiles[0];
        submitData.extraImages = formData.imageFiles.slice(1);
      }
      
      await apiService.createListing(submitData);
      alert('✅ Book listed successfully!');
      navigate('/student/dashboard');
    } catch (error) {
      alert('Failed to list book: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Book</h1>
          <p className="text-gray-600">List your book and connect with buyers</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <h2 className="text-xl font-semibold mb-6">Book Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter book title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter ISBN (optional)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                    <select
                      value={formData.class}
                      onChange={(e) => handleClassChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {classList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                    <select
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {getCategories().map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat })}
                        className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                          formData.category === cat
                            ? 'bg-primary-600 text-white border-primary-600 font-medium'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  {!formData.category && <p className="text-xs text-red-500 mt-1">Please select a category</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Describe the book condition, highlights, missing pages, etc."
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-6">Book Photos</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload book photos ({formData.images.length}/5)</p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload').click()}>
                    <PlusIcon className="h-4 w-4" />
                    Add Photos
                  </Button>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Book ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Live Preview</h3>
                <Card className="p-4 bg-gray-50">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {formData.images.length > 0 ? (
                      <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <h4 className="font-semibold">{formData.title || 'Book Title'}</h4>
                  <p className="text-sm text-gray-600">{formData.author || 'Author Name'}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold text-primary-600">₹{formData.price || '0'}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{formData.condition}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{formData.category} • {formData.class}</p>
                </Card>
              </div>
            </Card>
          </div>

          <Card className="mt-8 bg-yellow-50 border-2 border-yellow-400">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Content Policy</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>✓ Only academic and educational books allowed</li>
                  <li>✗ No adult, sexual, or inappropriate content</li>
                  <li>✗ No pirated or illegal copies</li>
                  <li>• Violations may result in account suspension</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="mt-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1"
                required
              />
              <span className="text-sm text-gray-700">
                I confirm that this book is academic/educational content and complies with the platform's content policy.
              </span>
            </label>
          </Card>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" onClick={() => navigate(-1)} variant="outline">Cancel</Button>
            <Button type="submit" loading={loading}>List Book</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
