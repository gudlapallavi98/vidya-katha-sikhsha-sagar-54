
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const { user, loading, session } = useAuth();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Effect to determine authentication status once loading is complete
  useEffect(() => {
    if (!loading) {
      // Verify we have both a user and a valid session
      const authenticated = !!user && !!session;
      setIsAuthenticated(authenticated);
      
      // Debug authentication state
      console.log('Auth state in ProtectedRoute:', { 
        authenticated, 
        user: !!user, 
        session: !!session,
        role: user?.role,
        pathname: location.pathname
      });
    }
  }, [user, session, loading, location.pathname]);

  // Show loading indicator while checking authentication
  if (loading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indian-blue"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
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
