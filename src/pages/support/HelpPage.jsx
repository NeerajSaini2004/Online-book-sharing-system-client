import React from 'react';
import { Card } from '../../components/ui/Card';

export const HelpPage = () => {
  const faqs = [
    { q: 'How do I sell a book?', a: 'Go to the Sell page, fill in book details, upload images, and submit.' },
    { q: 'How do I buy a book?', a: 'Browse books, click on a book, and click Buy Now to place an order.' },
    { q: 'What payment methods are accepted?', a: 'We accept online payment via Razorpay and Cash on Delivery.' },
    { q: 'How do I track my order?', a: 'Go to your Dashboard to see all your orders and their status.' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Help Center</h1>
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
