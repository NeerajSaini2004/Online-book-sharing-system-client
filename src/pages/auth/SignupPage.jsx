import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserIcon, EnvelopeIcon, PhoneIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';

const API = 'https://online-book-sharing-system-backend.onrender.com/api';

export const SignupPage = () => {
  const { updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Step 1: Validate form and send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setTempToken(data.tempToken);
        if (data.devOtp) {
          setOtp(data.devOtp);
          alert(`Dev Mode: Your OTP is ${data.devOtp}`);
        }
        setStep(2);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify-and-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tempToken,
          otp,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          role: 'student'
        })
      });
      const data = await res.json();
      if (data.success) {
        const userData = data.data.user;
        const token = data.data.token;
        localStorage.setItem('smartbook_user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        updateUser(userData);
        navigate('/role-selection');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/send-verification-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (data.success) {
        setTempToken(data.tempToken);
        setOtp('');
        alert('New OTP sent!');
      } else {
        setError(data.message);
      }
    } catch {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">BS</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {step === 1 ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-gray-600 mt-2 text-sm">
              {step === 1 ? 'Join BookShare community today' : `OTP sent to ${formData.email}`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-2">
            {[1, 2].map(s => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                s < step ? 'bg-green-500 text-white' :
                s === step ? 'bg-primary-600 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {s < step ? '✓' : s}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="text" placeholder="Full Name" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
              </div>

              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" placeholder="Email Address" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
              </div>

              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="tel" placeholder="10 digit phone number" value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{formData.phone.length}/10</span>
              </div>

              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Password (min 8 characters)" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              <div className="flex items-start">
                <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-600" required />
                <span className="ml-2 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary-600">Privacy Policy</Link>
                </span>
              </div>

              <Button type="submit" className="w-full" loading={loading}>
                Send Verification OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                📧 Check your email <strong>{formData.email}</strong> for the 6-digit OTP
              </div>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 text-center text-2xl font-bold tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">{otp.length}/6 digits • Valid for 10 minutes</p>

              <Button type="submit" className="w-full" loading={loading} disabled={otp.length !== 6}>
                Verify & Create Account
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => { setStep(1); setOtp(''); setError(''); }} className="text-gray-500 hover:text-gray-700">
                  ← Change Email
                </button>
                <button type="button" onClick={handleResendOTP} className="text-primary-600 hover:text-primary-700">
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-medium">Sign in</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
