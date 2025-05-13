
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { StudentAchievement } from '../types';

/**
 * Hook to fetch student achievements
 */
export const useStudentAchievements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('student_id', user?.id);
        
      if (error) throw error;
      return data as StudentAchievement[];
    },
    enabled: !!user,
  });
};
