import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FileUploader } from '../../components/ui/FileUploader';
import { useAuth } from '../../context/AuthContext';

const API = 'https://online-book-sharing-system-backend.onrender.com/api';

export const KYCUploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  
  // Auto set kycType based on user role
  const kycType = user?.role === 'library' ? 'library' : 'student';

  const handleFileUpload = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one document');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('documentType', kycType);
      uploadedFiles.forEach(file => formData.append('documents', file));

      const response = await fetch(`${API}/users/kyc/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update user kycStatus in context
        updateUser({ kycStatus: 'pending' });
        alert('✅ KYC documents submitted successfully!\n\nYour documents will be reviewed within 24-48 hours.');
        const role = user?.role;
        navigate(role === 'library' ? '/library/dashboard' : '/student/dashboard');
      } else {
        setError(data.message || 'KYC submission failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <DocumentArrowUpIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent mb-4">KYC Verification</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Upload your documents to verify your identity and start selling on SmartBook Sharing
          </p>
        </motion.div>

        <Card className="shadow-2xl border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
              <p className="text-sm font-medium text-primary-800">
                {kycType === 'library' ? '📚 Library Verification - Upload GST certificate, library registration, and official ID proof' : '🎓 Student Verification - Upload your college ID card and any additional verification documents'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Documents
              </label>
              <FileUploader
                onFilesChange={handleFileUpload}
                acceptedTypes={['image/*', '.pdf']}
                maxFiles={3}
                maxSize={10 * 1024 * 1024}
              />
              <div className="mt-2 text-sm text-gray-500">
                {kycType === 'student' 
                  ? 'Accepted: College ID, Aadhar Card, Student Certificate'
                  : 'Accepted: GST Certificate, Library Registration, Official ID'
                }
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200 rounded-2xl p-5 shadow-md">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <DocumentArrowUpIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-1">⚡ Quick Verification Process</p>
                  <p>Your documents will be reviewed within 24-48 hours. You'll receive an email notification once verified.</p>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all" 
              disabled={uploadedFiles.length === 0 || loading}
            >
              {loading ? 'Submitting...' : '✓ Submit for Verification'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};