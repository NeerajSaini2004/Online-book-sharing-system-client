import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BookShare</h3>
            <p className="text-gray-400">Share knowledge, build community</p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/browse" className="block text-gray-400 hover:text-white">Browse Books</Link>
              <Link to="/sell" className="block text-gray-400 hover:text-white">Sell Books</Link>
              <Link to="/blog" className="block text-gray-400 hover:text-white">Blog</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link to="/help" className="block text-gray-400 hover:text-white">Help Center</Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white">Contact Us</Link>
              <Link to="/safety" className="block text-gray-400 hover:text-white">Safety Guidelines</Link>
              <Link to="/disputes" className="block text-gray-400 hover:text-white">Dispute Resolution</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <Link to="/terms" className="block text-gray-400 hover:text-white">Terms of Service</Link>
              <Link to="/privacy" className="block text-gray-400 hover:text-white">Privacy Policy</Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 BookShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};