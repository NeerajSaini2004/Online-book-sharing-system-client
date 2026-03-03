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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartbook_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const account = testAccounts[email];
      
      if (!account || account.password !== password) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userWithoutPassword } = account;
      setUser(userWithoutPassword);
      localStorage.setItem('smartbook_user', JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
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
    window.location.replace('/');
  };

  const value = {
    user,
    login,
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