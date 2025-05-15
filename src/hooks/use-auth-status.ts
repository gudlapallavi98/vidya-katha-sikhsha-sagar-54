
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function useAuthStatus() {
  const { user, loading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/login");
      }
      setIsChecking(false);
    }
  }, [user, loading, navigate]);

  return { isAuthenticated: !!user, user, isChecking };
}
