import React from 'react';

export const Skeleton = ({ className = '', width, height }) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={{ width, height }}
    />
  );
};