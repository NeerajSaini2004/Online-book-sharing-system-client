import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/home/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { RoleSelectionPage } from './pages/auth/RoleSelectionPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { SearchPage } from './pages/books/SearchPage';
import { SellPage } from './pages/books/SellPage';
import { NotesPage } from './pages/notes/NotesPage';
import { UploadNotesPage } from './pages/notes/UploadNotesPage';
import { BlogPage } from './pages/blog/BlogPage';
import { FormPage } from './pages/blog/FormPage';
import { KYCUploadPage } from './pages/auth/KYCUploadPage';
import { BookDetailPage } from './pages/books/BookDetailPage';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { LibraryDashboard } from './pages/dashboard/LibraryDashboard';
import { ProfilePage } from './pages/profile/ProfilePage';
import { ChatPage } from './pages/chat/ChatPage';
import { HelpPage } from './pages/support/HelpPage';
import { ContactPage } from './pages/support/ContactPage';
import { SafetyPage } from './pages/support/SafetyPage';
import { DisputePage } from './pages/support/DisputePage';
import { OrderDetails } from './pages/orders/OrderDetails';
import { TermsOfService } from './pages/legal/TermsOfService';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';

function AppContent() {
  const { user } = useAuth();
  const userRole = user?.role || 'student';
  


  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/role-selection" element={<RoleSelectionPage />} />
            <Route path="/browse" element={<SearchPage />} />
            <Route path="/sell" element={<SellPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/upload" element={<UploadNotesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<FormPage />} />
            <Route path="/kyc-upload" element={<KYCUploadPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/library/dashboard" element={<LibraryDashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/disputes" element={<DisputePage />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;