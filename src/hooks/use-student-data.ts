
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
      if (!user) return [];
      
      // Get sessions where the student is an attendee
      const { data: attendeeSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select('session_id')
        .eq('student_id', user.id);
        
      if (attendeeError) throw attendeeError;
      
      if (!attendeeSessions || attendeeSessions.length === 0) {
        // Fallback to fetch from enrollments
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id);
          
        if (enrollmentsError) throw enrollmentsError;
        
        if (!enrollments || enrollments.length === 0) {
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
      }
      
      // If we have session attendees, fetch those specific sessions
      const sessionIds = attendeeSessions.map(a => a.session_id);
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('id', sessionIds)
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
