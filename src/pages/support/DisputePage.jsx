import React from 'react';
import { Card } from '../../components/ui/Card';

export const DisputePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Dispute Resolution</h1>
        <Card className="p-8 space-y-6">
          <p className="text-gray-600">
            If you encounter any issues with a transaction, follow these steps:
          </p>
          <ol className="list-decimal pl-6 space-y-4 text-gray-600">
            <li>Contact the other party through our chat system</li>
            <li>Try to resolve the issue amicably</li>
            <li>If unresolved, raise a dispute ticket from your dashboard</li>
            <li>Our support team will review and mediate within 48 hours</li>
            <li>Decision will be based on evidence provided by both parties</li>
          </ol>
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Keep all communication and transaction records for dispute resolution.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
