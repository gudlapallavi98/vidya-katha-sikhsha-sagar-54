
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User authenticated, checking role for redirect:", user);
      
      // Get user profile to determine role and redirect appropriately
      const checkUserRole = async () => {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          console.log("Profile data for redirect:", profile);
          
          if (error) {
            console.error("Error fetching profile for redirect:", error);
            navigate('/');
            return;
          }

          if (profile?.role === 'teacher') {
            console.log("Redirecting to teacher dashboard");
            navigate('/teacher-dashboard');
          } else if (profile?.role === 'student') {
            console.log("Redirecting to student dashboard");
            navigate('/student-dashboard');
          } else {
            console.log("No role found, redirecting to home");
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          navigate('/');
        }
      };

      // Small delay to ensure auth context is fully loaded
      setTimeout(() => {
        checkUserRole();
      }, 100);
    }
  }, [user, navigate]);
};
