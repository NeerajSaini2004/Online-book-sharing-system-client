import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Toast } from '../../components/ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

export const UploadNotesPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    description: '',
    price: '',
    pages: '',
    isFree: false
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const subjects = {
    default: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Computer Science', 'History', 'Geography', 'Economics'],
    Engineering: ['Computer Science Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Electronics & Communication', 'Chemical Engineering', 'Aerospace Engineering', 'Biotechnology', 'Information Technology', 'Data Science']
  };
  const classes = ['9th', '10th', '11th', '12th', 'JEE', 'NEET', 'Engineering'];

  const getSubjects = () => formData.class === 'Engineering' ? subjects.Engineering : subjects.default;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = { ...formData, [name]: type === 'checkbox' ? checked : value };
    if (name === 'class') updated.subject = '';
    setFormData(updated);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setToast({
          type: 'error',
          message: 'Only PDF files are allowed'
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setToast({
          type: 'error',
          message: 'File size should be less than 10MB'
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setToast({
        type: 'error',
        message: 'Please select a PDF file'
      });
      return;
    }

    setLoading(true);
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      data.append('notesFile', file);
      const token = localStorage.getItem('token');

      if (!token) {
        setToast({ type: 'error', message: 'Please login first to upload notes' });
        setLoading(false);
        return;
      }

      const response = await fetch(`https://online-book-sharing-system-backend.onrender.com/api/notes/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setToast({ type: 'error', message: result.message || 'Upload failed. Please try again.' });
        return;
      }

      setToast({ type: 'success', message: 'Notes uploaded successfully!' });
      setFormData({ title: '', subject: '', class: '', description: '', price: '', pages: '', isFree: false });
      setFile(null);
    } catch (error) {
      setToast({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Notes</h1>
          <p className="text-gray-600">Share your study notes and earn money</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter notes title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Subject</option>
                  {getSubjects().map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class *
                </label>
                <select
                  name="class"
                  value={formData.class}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFree"
                      checked={formData.isFree}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <span className="text-sm font-medium text-green-600">Make this FREE</span>
                  </label>
                </div>
                {!formData.isFree && (
                  <Input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                )}
                {formData.isFree && (
                  <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 font-medium">
                    ✓ Free — anyone can download directly
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Pages *
                </label>
                <Input
                  name="pages"
                  type="number"
                  value={formData.pages}
                  onChange={handleInputChange}
                  placeholder="Enter page count"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your notes content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload PDF File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6">
                {!file ? (
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="text-center">
                      <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Click anywhere here to upload PDF
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        Maximum file size: 10MB
                      </span>
                    </div>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-8 w-8 text-primary-600" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Upload Notes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};