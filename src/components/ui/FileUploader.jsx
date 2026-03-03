import React, { useState } from 'react';
import { CloudArrowUpIcon, DocumentIcon } from '@heroicons/react/24/outline';

export const FileUploader = ({ 
  onFileSelect,
  onFilesChange, // Add support for both prop names
  accept = "*", 
  acceptedTypes = ["*"],
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFiles = (fileList) => {
    let validFiles = fileList.filter(file => file.size <= maxSize);
    
    // Limit number of files if maxFiles is specified
    if (maxFiles && validFiles.length > maxFiles) {
      validFiles = validFiles.slice(0, maxFiles);
    }
    
    setFiles(validFiles);
    // Support both callback prop names
    onFileSelect?.(validFiles);
    onFilesChange?.(validFiles);
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Maximum file size: {Math.round(maxSize / 1024 / 1024)}MB
        </p>
        <input
          type="file"
          accept={acceptedTypes.length > 0 ? acceptedTypes.join(',') : accept}
          multiple={multiple || maxFiles > 1}
          onChange={(e) => handleFiles(Array.from(e.target.files || []))}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
        >
          Select Files
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{file.name}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {Math.round(file.size / 1024)}KB
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};