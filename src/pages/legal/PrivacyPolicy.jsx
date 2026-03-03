import React from 'react';
import { Card } from '../../components/ui/Card';

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        
        <Card className="p-8">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <ul className="text-gray-700 space-y-1 list-disc pl-6">
                    <li>Name, email address, and phone number</li>
                    <li>Profile information and preferences</li>
                    <li>Payment and billing information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Information</h3>
                  <ul className="text-gray-700 space-y-1 list-disc pl-6">
                    <li>Books you list, buy, or browse</li>
                    <li>Messages and communications on the platform</li>
                    <li>Device information and IP address</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">How We Use Your Information</h2>
              <ul className="text-gray-700 space-y-2 list-disc pl-6">
                <li>To provide and maintain our book sharing services</li>
                <li>To process transactions and send notifications</li>
                <li>To improve our platform and user experience</li>
                <li>To prevent fraud and ensure platform security</li>
                <li>To communicate important updates and offers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">Information Sharing</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share information in these situations:
              </p>
              <ul className="text-gray-700 space-y-2 list-disc pl-6">
                <li>With other users as necessary for transactions (name, contact info)</li>
                <li>With service providers who help us operate the platform</li>
                <li>When required by law or to protect our rights</li>
                <li>In case of business transfer or merger</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, 
                secure servers, and regular security audits. However, no method of transmission over the internet 
                is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">Your Rights</h2>
              <ul className="text-gray-700 space-y-2 list-disc pl-6">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing communications</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to improve your experience, analyze usage patterns, 
                and provide personalized content. You can control cookie settings through your browser.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-primary-700">Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                BookShare is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </section>

            <div className="bg-primary-50 p-4 rounded-lg mt-8">
              <p className="text-sm text-primary-800">
                <strong>Last Updated:</strong> January 2024<br/>
                For privacy-related questions, contact us at privacy@bookshare.com
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};