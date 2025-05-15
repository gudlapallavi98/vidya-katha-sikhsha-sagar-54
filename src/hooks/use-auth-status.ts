
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function useAuthStatus(redirectTo = "/login") {
  const { user, loading, session } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Once the auth loading state finishes
    if (!loading) {
      // If no user is found, redirect to login
      if (!user) {
        navigate(redirectTo);
      }
      // Complete the checking process
      setIsChecking(false);
    }
  }, [user, loading, navigate, redirectTo]);

  return { 
    isAuthenticated: !!user, 
    user, 
    isChecking,
    session
  };
}

// For pages that should only be accessible to non-authenticated users
export function useRedirectAuthenticated(redirectTo = "/") {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // If user is already authenticated, redirect based on their role
      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate(redirectTo);
      }
    }
  }, [user, loading, navigate, redirectTo]);

  return { isLoading: loading };
}
