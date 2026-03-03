import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'default',
  onClick
}) => {
  const paddingClasses = {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const variants = {
    default: 'bg-white border border-secondary-100 shadow-md',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
    gradient: 'bg-gradient-to-br from-white via-primary-50/30 to-secondary-50/50 border border-primary-100 shadow-lg',
    elevated: 'bg-white border-0 shadow-xl',
    outlined: 'bg-transparent border-2 border-secondary-200 shadow-sm'
  };

  const hoverEffects = hover ? {
    whileHover: { 
      y: -8, 
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <motion.div
      {...hoverEffects}
      className={`rounded-2xl transition-all duration-300 ${variants[variant]} ${paddingClasses[padding]} ${hover ? 'hover:shadow-2xl cursor-pointer transform-gpu' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};