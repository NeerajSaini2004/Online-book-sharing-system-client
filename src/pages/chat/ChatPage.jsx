import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const ChatPage = () => {
  const location = useLocation();
  const { sellerId, bookId, bookTitle } = location.state || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        text: message,
        sender: 'me',
        timestamp: new Date()
      }]);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-bold">Chat with Seller</h2>
            {bookTitle && <p className="text-sm text-gray-600">About: {bookTitle}</p>}
          </div>

          <div className="h-96 overflow-y-auto mb-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Start a conversation with the seller
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === 'me'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <Button onClick={handleSendMessage}>
              <PaperAirplaneIcon className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
