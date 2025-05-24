
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useLoginRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Get user profile to determine role and redirect appropriately
      const checkUserRole = async () => {
        try {
          const { supabase } = await import('@/integrations/supabase/client');
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile?.role === 'teacher') {
            navigate('/teacher-dashboard');
          } else if (profile?.role === 'student') {
            navigate('/student-dashboard');
          } else {
            navigate('/');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          navigate('/');
        }
      };

      checkUserRole();
    }
  }, [user, navigate]);
};
