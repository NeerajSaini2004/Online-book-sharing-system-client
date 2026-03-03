import React from 'react';
import { Card } from '../../components/ui/Card';

export const SafetyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Safety Guidelines</h1>
        <Card className="p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">For Buyers</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Always verify book condition before payment</li>
              <li>Meet in public places for local pickup</li>
              <li>Check seller ratings and reviews</li>
              <li>Use platform payment methods only</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">For Sellers</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600">
              <li>Provide accurate book descriptions</li>
              <li>Upload clear photos of the book</li>
              <li>Respond to buyer queries promptly</li>
              <li>Ship items within promised timeframe</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};
