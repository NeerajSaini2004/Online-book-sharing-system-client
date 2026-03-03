import React from 'react';
import { Card } from '../../components/ui/Card';

export const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Terms of Service</h1>
        
        <Card className="p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using BookShare, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">2. Book Listing and Selling</h2>
              <ul className="text-gray-700 space-y-2 list-disc pl-6">
                <li>You may only list books that you legally own</li>
                <li>Books must be in the condition described in your listing</li>
                <li>Provide accurate information about book condition and content</li>
                <li>You are responsible for setting fair prices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">3. User Responsibilities</h2>
              <ul className="text-gray-700 space-y-2 list-disc pl-6">
                <li>Maintain the security of your account credentials</li>
                <li>Provide accurate personal and contact information</li>
                <li>Communicate respectfully with other users</li>
                <li>Complete transactions in a timely manner</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">4. Prohibited Activities</h2>
              <ul className="text-gray-700 space-y-2 list-disc pl-6">
                <li>Selling counterfeit or pirated books</li>
                <li>Creating multiple accounts to manipulate the system</li>
                <li>Harassment or inappropriate behavior toward other users</li>
                <li>Attempting to circumvent platform fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">5. Platform Fees and Payments</h2>
              <p className="text-gray-700 leading-relaxed">
                BookShare may charge service fees for transactions. All fees will be clearly disclosed before completion of any transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">6. Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                In case of disputes between users, BookShare will provide mediation services. Our decision in disputes will be final.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">7. Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                BookShare reserves the right to terminate accounts that violate these terms or engage in fraudulent activities.
              </p>
            </section>

            <div className="bg-primary-50 p-4 rounded-lg mt-8">
              <p className="text-sm text-primary-800">
                <strong>Last Updated:</strong> January 2024<br/>
                For questions about these terms, please contact us at legal@bookshare.com
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};