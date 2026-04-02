import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { categories, classes, boards } from '../../data/books';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const SellPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    originalPrice: '',
    condition: 'Good',
    category: 'General',
    class: '12th',
    board: 'CBSE',
    description: '',
    images: [],
    imageFiles: []
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

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
    const newImages = formData.images.filter((_, i) => i !== index);
    const newImageFiles = formData.imageFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages, imageFiles: newImageFiles });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      alert('Please accept the Terms & Conditions');
      return;
    }
    
    if (!formData.title || !formData.author || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Content validation
    const inappropriateKeywords = ['sex', 'adult', 'porn', 'nude', 'explicit'];
    const contentToCheck = `${formData.title} ${formData.description}`.toLowerCase();
    const hasInappropriate = inappropriateKeywords.some(word => contentToCheck.includes(word));
    
    if (hasInappropriate) {
      alert('⚠️ Content Policy Violation\n\nYour listing contains inappropriate content and cannot be published.\n\nOnly academic books are allowed on this platform.');
      return;
    }
    
    try {
      const submitData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        condition: formData.condition || 'Good',
        category: formData.category || 'General',
        description: formData.description,
        status: 'active'
      };
      
      if (formData.imageFiles.length > 0) {
        submitData.bookImage = formData.imageFiles[0];
      }
      
      await apiService.createListing(submitData);
      alert('✅ Book submitted for review!\n\nYour listing will be reviewed by our team within 24 hours.');
      navigate('/student/dashboard');
    } catch (error) {
      alert('Failed to list book: ' + error.message);
    }
  };

  const handleSaveDraft = () => {
    if (!formData.title) {
      alert('Please enter at least a book title');
      return;
    }
    alert(`Draft saved!\nTitle: ${formData.title}`);
    console.log('Draft saved:', formData);
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                    <select
                      value={formData.class}
                      onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {classes.filter(c => c !== 'All Classes').map(cls =>
                        <option key={cls} value={cls}>{cls}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Board</label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {boards.filter(b => b !== 'All Boards').map(board =>
                        <option key={board} value={board}>{board}</option>
                      )}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Describe the book condition, any highlights, missing pages, etc."
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-6">Book Photos</h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
                  <label htmlFor="photo-upload">
                    <Button type="button" variant="outline" onClick={() => document.getElementById('photo-upload').click()}>
                      <PlusIcon className="h-4 w-4" />
                      Add Photos
                    </Button>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Book ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Add up to 5 photos. Include front cover, back cover, and any damage or highlights.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <Card className="p-4">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                    {formData.images.length > 0 ? (
                      <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <PhotoIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <h4 className="font-semibold">{formData.title || 'Book Title'}</h4>
                  <p className="text-sm text-gray-600">{formData.author || 'Author Name'}</p>
                  <p className="text-lg font-bold text-primary-600 mt-2">
                    ₹{formData.price || '0'}
                  </p>
                </Card>
              </div>
            </Card>
          </div>

          {/* Content Policy Warning */}
          <Card className="mt-8 bg-yellow-50 border-2 border-yellow-400">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Content Policy</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>✓ Only academic and educational books allowed</li>
                  <li>✗ No adult, sexual, or inappropriate content</li>
                  <li>✗ No pirated or illegal copies</li>
                  <li>• All listings are reviewed before publishing</li>
                  <li>• Violations may result in account suspension</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Terms & Conditions */}
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
                I understand that inappropriate content will be rejected and may result in account suspension.
              </span>
            </label>
          </Card>

          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" onClick={handleSaveDraft} variant="outline">Save as Draft</Button>
            <Button type="submit">List Book</Button>
          </div>
        </form>
      </div>
    </div>
  );
};