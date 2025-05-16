
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ExtendedUser } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher' | string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indian-blue"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is required but user doesn't have it, redirect
  if (requiredRole) {
    const userRole = (user as ExtendedUser)?.role;
    
    if (userRole !== requiredRole) {
      // If student tries to access teacher dashboard or vice versa
      if (userRole === 'student') {
        return <Navigate to="/student-dashboard" replace />;
      } else if (userRole === 'teacher') {
        return <Navigate to="/teacher-dashboard" replace />;
      }
      // If no valid role, go to home
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
