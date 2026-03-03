import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentIcon, CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import userService from '../../services/userService';

export const KYCUpload = ({ user, onUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documentType, setDocumentType] = useState('identity');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = [
    { value: 'identity', label: 'Identity Proof (Aadhar/PAN/Passport)' },
    { value: 'address', label: 'Address Proof' },
    { value: 'academic', label: 'Academic Certificate (for students)' },
    { value: 'business', label: 'Business Registration (for libraries)' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('documents', file);
      });
      formData.append('documentType', documentType);

      const response = await userService.uploadKYCDocuments(formData);
      if (response.success) {
        onUpdate(response.data.user);
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('KYC upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">KYC Verification</h2>
          <Badge variant={getStatusColor(user?.kycStatus)}>
            {user?.kycStatus?.toUpperCase()}
          </Badge>
        </div>

        {user?.kycStatus === 'verified' ? (
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
            <span className="text-green-700">Your KYC verification is complete!</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                {documentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Drag and drop files here, or{' '}
                <label className="text-primary-600 cursor-pointer hover:underline">
                  browse
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, JPG, PNG (Max 5MB each)
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Selected Files:</h4>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <DocumentIcon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Documents'}
            </Button>
          </div>
        )}

        {user?.kycDocuments?.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Uploaded Documents:</h4>
            <div className="space-y-2">
              {user.kycDocuments.map((doc, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <DocumentIcon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{doc.type} Document</span>
                  <Badge variant="secondary" size="sm">Uploaded</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};