import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export const Toast = ({ 
  type = 'info', 
  message, 
  onClose 
}) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`flex items-center p-4 rounded-lg border ${colors[type]}`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-3 text-gray-400 hover:text-gray-600">
          ×
        </button>
      )}
    </motion.div>
  );
};