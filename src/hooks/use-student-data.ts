
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Enrollment, Progress, StudentAchievement } from './types';

export const useStudentEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('student_id', user.id);
        
      if (error) throw error;
      return data as Enrollment[];
    },
    enabled: !!user,
  });
};

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

export const useStudentUpcomingSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['upcoming_sessions', user?.id],
    queryFn: async () => {
      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('enrollments')
        .select('course_id')
        .eq('student_id', user?.id);
        
      if (enrollmentsError) throw enrollmentsError;
      
      if (!enrollments.length) {
        return [];
      }
      
      const courseIds = enrollments.map(e => e.course_id);
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('course_id', courseIds)
        .gt('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(10);
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
