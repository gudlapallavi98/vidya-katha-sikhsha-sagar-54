
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
      
      console.log("Fetching upcoming sessions for student:", user.id);
      
      // Get current time and add a small buffer to ensure we get truly upcoming sessions
      const now = new Date();
      const currentTime = now.toISOString();
      
      console.log("Current time for filtering:", currentTime);
      
      // First, get sessions where the student is an attendee
      const { data: attendeeSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select('session_id')
        .eq('student_id', user.id);
        
      if (attendeeError) {
        console.error("Error fetching attendee sessions:", attendeeError);
        throw attendeeError;
      }
      
      console.log("Found attendee sessions:", attendeeSessions);
      
      if (!attendeeSessions || attendeeSessions.length === 0) {
        console.log("No attendee sessions found, checking enrollments...");
        // Fallback to fetch from enrollments
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id);
          
        if (enrollmentsError) throw enrollmentsError;
        
        if (!enrollments || enrollments.length === 0) {
          console.log("No enrollments found");
          return [];
        }
        
        const courseIds = enrollments.map(e => e.course_id);
        console.log("Checking course sessions for courses:", courseIds);
        
        const { data, error } = await supabase
          .from('sessions')
          .select(`
            *,
            course:courses(title)
          `)
          .in('course_id', courseIds)
          .gt('start_time', currentTime)
          .in('status', ['scheduled', 'in_progress'])
          .order('start_time', { ascending: true })
          .limit(10);
          
        if (error) throw error;
        console.log("Found course sessions:", data);
        return data;
      }
      
      // If we have session attendees, fetch those specific sessions
      const sessionIds = attendeeSessions.map(a => a.session_id);
      console.log("Fetching specific sessions:", sessionIds);
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('id', sessionIds)
        .gt('start_time', currentTime)
        .in('status', ['scheduled', 'in_progress'])
        .order('start_time', { ascending: true });
        
      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      console.log("Final upcoming sessions data:", data);
      return data;
    },
    enabled: !!user,
  });
};
