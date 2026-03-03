import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FileUploader } from '../../components/ui/FileUploader';

export const KYCUploadPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [kycType, setKycType] = useState('library');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate KYC submission
      console.log('KYC submitted:', { kycType, files: uploadedFiles });
      
      // After successful submission, redirect to dashboard
      setTimeout(() => {
        navigate('/library/dashboard');
      }, 1000);
    } catch (error) {
      console.error('KYC submission failed:', error);
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setKycType('student')}
                  className={`p-6 border-2 rounded-2xl text-center transition-all transform hover:scale-105 ${
                    kycType === 'student'
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-purple-50 text-primary-700 shadow-lg'
                      : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">🎓</div>
                  <div className="font-semibold text-lg">Student</div>
                  <div className="text-sm text-gray-500 mt-1">College ID required</div>
                </button>
                <button
                  type="button"
                  onClick={() => setKycType('library')}
                  className={`p-6 border-2 rounded-2xl text-center transition-all transform hover:scale-105 ${
                    kycType === 'library'
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-purple-50 text-primary-700 shadow-lg'
                      : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">📚</div>
                  <div className="font-semibold text-lg">Library</div>
                  <div className="text-sm text-gray-500 mt-1">GST/Registration required</div>
                </button>
              </div>
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
                  ? 'Upload your college ID card and any additional verification documents'
                  : 'Upload GST certificate, library registration, and official ID proof'
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