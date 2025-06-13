import PaymentSuccess from "./pages/PaymentSuccess";
import { Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import NotFound from './pages/NotFound';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import FAQPage from './pages/FAQPage';
import SupportPage from './pages/SupportPage';
import ProtectedRoute from './components/ProtectedRoute';

const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage'));
const TeacherDashboardPage = lazy(() => import('./pages/TeacherDashboardPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indian-blue"></div>
  </div>
);

const AuthRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'student') {
    return <Navigate to="/student-dashboard" replace />;
  } else if (user.role === 'teacher') {
    return <Navigate to="/teacher-dashboard" replace />;
  }
  
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="signup" element={<SignUpPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="payment-success" element={<PaymentSuccess />} />
            <Route path="dashboard" element={<AuthRedirect />} />
            <Route 
              path="student-dashboard/*" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Suspense fallback={<LoadingFallback />}>
                    <StudentDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="teacher-dashboard/*" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <Suspense fallback={<LoadingFallback />}>
                    <TeacherDashboardPage />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HelmetProvider>
    </AuthProvider>
  );
}

export default App;
