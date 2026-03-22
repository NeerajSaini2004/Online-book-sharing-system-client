import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Test accounts
const testAccounts = {
  'student@test.com': {
    id: '1',
    email: 'student@test.com',
    password: 'student123',
    name: 'Test Student',
    role: 'student',
    college: 'Delhi University',
    academicInterests: ['Computer Science', 'Mathematics'],
    kycStatus: 'verified',
    rating: { average: 4.5, count: 12 },
    isActive: true
  },
  'library@test.com': {
    id: '2',
    email: 'library@test.com',
    password: 'library123',
    name: 'Test Library',
    role: 'library',
    libraryName: 'Central Academic Library',
    location: {
      address: '123 Library Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001'
    },
    gstNumber: 'GST123456789',
    kycStatus: 'verified',
    rating: { average: 4.8, count: 45 },
    isActive: true
  }
};

const API_BASE_URL = 'https://online-book-sharing-system-backend.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartbook_user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // First try real backend login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const userData = data.data.user;
          const token = data.data.token;
          setUser(userData);
          localStorage.setItem('smartbook_user', JSON.stringify(userData));
          localStorage.setItem('token', token);
          return { success: true, user: userData };
        }
      }

      // Fallback to test accounts
      const account = testAccounts[email];
      if (!account || account.password !== password) {
        throw new Error('Invalid email or password');
      }
      const { password: _, ...userWithoutPassword } = account;
      const mockToken = `mock_token_${userWithoutPassword.id}_${Date.now()}`;
      setUser(userWithoutPassword);
      localStorage.setItem('smartbook_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('token', mockToken);
      return { success: true, user: userWithoutPassword };

    } catch (error) {
      // Fallback to test accounts on network error
      const account = testAccounts[email];
      if (account && account.password === password) {
        const { password: _, ...userWithoutPassword } = account;
        const mockToken = `mock_token_${userWithoutPassword.id}_${Date.now()}`;
        setUser(userWithoutPassword);
        localStorage.setItem('smartbook_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', mockToken);
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async (credential) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      const data = await response.json();
      if (data.success) {
        const { user: userData, token } = data.data;
        setUser(userData);
        localStorage.setItem('smartbook_user', JSON.stringify(userData));
        localStorage.setItem('token', token);
        return { success: true, user: userData };
      }
      return { success: false, error: data.message };
    } catch (error) {
      return { success: false, error: 'Google login failed' };
    }
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('smartbook_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartbook_user');
    localStorage.removeItem('token');
    localStorage.removeItem('smartbook_token');
    window.location.replace('/');
  };

  const value = {
    user,
    login,
    googleLogin,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};