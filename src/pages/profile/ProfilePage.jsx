import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  PencilIcon,
  ShieldCheckIcon,
  MapPinIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Rating } from '../../components/ui/Rating';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    libraryName: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        college: user.college || '',
        libraryName: user.libraryName || '',
        city: user.location?.city || '',
        state: user.location?.state || ''
      });
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        ...(user.role === 'student' && { college: formData.college }),
        ...(user.role === 'library' && { 
          libraryName: formData.libraryName,
          location: { city: formData.city, state: formData.state }
        })
      };

      const response = await fetch('https://online-book-sharing-system-backend.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (data.success) {
        updateUser(data.data.user);
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const handleKYCUpload = () => {
    navigate('/kyc-upload');
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://online-book-sharing-system-backend.onrender.com/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(data.message || 'Failed to change password');
      }
    } catch (error) {
      alert('Failed to change password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-16 w-16 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-display font-bold text-secondary-900">
                    {user?.name}
                  </h1>
                  {user?.kycStatus === 'verified' && (
                    <ShieldCheckIcon className="h-6 w-6 text-green-500" />
                  )}
                  <Badge variant={user?.role === 'library' ? 'primary' : 'secondary'}>
                    {user?.role}
                  </Badge>
                </div>
                <p className="text-secondary-600 mb-2">{user?.email}</p>
                <div className="flex items-center space-x-4">
                  <Rating value={user?.rating?.average || 0} size="sm" />
                  <span className="text-sm text-secondary-600">
                    ({user?.rating?.count || 0} reviews)
                  </span>
                </div>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant="outline">
                <PencilIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-display font-bold text-secondary-900 mb-4">
                Personal Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <p className="text-secondary-900">{user?.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4 text-secondary-500" />
                    <span className="text-secondary-900">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      maxLength={10}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({...formData, phone: val});
                      }}
                      placeholder="10 digit mobile number"
                      className="w-full p-2 border rounded-lg"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-secondary-500" />
                      <span className="text-secondary-900">{user?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {user?.role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      College/University
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.college}
                        onChange={(e) => setFormData({...formData, college: e.target.value})}
                        className="w-full p-2 border rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <AcademicCapIcon className="h-4 w-4 text-secondary-500" />
                        <span className="text-secondary-900">{user?.college || 'Not provided'}</span>
                      </div>
                    )}
                  </div>
                )}

                {user?.role === 'library' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Library Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.libraryName}
                          onChange={(e) => setFormData({...formData, libraryName: e.target.value})}
                          className="w-full p-2 border rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center space-x-2">
                          <BuildingLibraryIcon className="h-4 w-4 text-secondary-500" />
                          <span className="text-secondary-900">{user?.libraryName || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Location
                      </label>
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            className="p-2 border rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => setFormData({...formData, state: e.target.value})}
                            className="p-2 border rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <MapPinIcon className="h-4 w-4 text-secondary-500" />
                          <span className="text-secondary-900">
                            {user?.location?.city || 'N/A'}, {user?.location?.state || 'N/A'}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {isEditing && (
                  <div className="flex space-x-3 pt-4">
                    <Button onClick={handleSave} className="flex-1">Save Changes</Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">Cancel</Button>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-display font-bold text-secondary-900 mb-4">
                Account Status
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-700">KYC Verification</span>
                  <Badge variant={user?.kycStatus === 'verified' ? 'success' : 'warning'}>
                    {user?.kycStatus || 'pending'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-700">Account Status</span>
                  <Badge variant={user?.isActive ? 'success' : 'error'}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-secondary-700">Member Since</span>
                  <span className="text-secondary-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="pt-4 space-y-2">
                  <Button onClick={handleKYCUpload} variant="outline" className="w-full">
                    Update KYC Documents
                  </Button>
                  <Button onClick={() => setShowPasswordModal(true)} variant="outline" className="w-full">
                    Change Password
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <Button onClick={handlePasswordChange} className="flex-1">Change Password</Button>
                <Button onClick={() => setShowPasswordModal(false)} variant="outline" className="flex-1">Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};