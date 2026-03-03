import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AcademicCapIcon, BuildingLibraryIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

export const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const navigate = useNavigate();
  const { updateuser } = useAuth();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Buy and sell textbooks, access digital notes, and connect with peers',
      icon: AcademicCapIcon,
      features: [
        'Buy & sell textbooks',
        'Access digital notes',
        'Join study groups',
        'Participate in forums',
        'Track your orders'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'library',
      title: 'Library',
      description: 'Manage inventory, bulk sales, and serve the academic community',
      icon: BuildingLibraryIcon,
      features: [
        'Bulk inventory management',
        'Analytics dashboard',
        'Verified seller badge',
        'Priority support',
        'Custom pricing tools'
      ],
      color: 'from-green-500 to-green-600'
    }
  ];

  const handleContinue = () => {
    if (!selectedRole) return;
    
    updateuser({ role: selectedRole });
    
    if (selectedRole === 'library') {
      navigate('/kyc-upload');
    } else {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">BS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Role</h1>
          <p className="text-gray-600">Select how you'll be using BookShare</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <motion.div
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 ${isSelected
                      ? 'ring-2 ring-primary-500 border-primary-200'
                      : 'hover:shadow-lg'
                    }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="relative">
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                    )}

                    <div className={`w-16 h-16 bg-gradient-to-r ${role.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                    <p className="text-gray-600 mb-6">{role.description}</p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What you can do:</h4>
                      <ul className="space-y-2">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            size="lg"
            className="px-8"
          >
            Continue Setup
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            You can change your role later in account settings
          </p>
        </div>
      </motion.div>
    </div>
  );
};