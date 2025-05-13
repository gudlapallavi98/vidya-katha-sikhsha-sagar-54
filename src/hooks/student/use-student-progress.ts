
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '../types';

/**
 * Hook to fetch student progress
 */
export const useStudentProgress = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['progress', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress')
        .select(`
          *,
          lesson:lessons(*)
        `)
        .eq('student_id', user?.id);
        
      if (error) throw error;
      return data as Progress[];
    },
    enabled: !!user,
  });
};
