
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
      
      // Get current time in UTC
      const now = new Date();
      const currentTime = now.toISOString();
      
      console.log("Current time for filtering:", currentTime);
      
      // Get sessions where the student is an attendee
      const { data: attendeeSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select('session_id')
        .eq('student_id', user.id);
        
      if (attendeeError) {
        console.error("Error fetching attendee sessions:", attendeeError);
      }
      
      console.log("Found attendee sessions:", attendeeSessions);
      
      let sessionIds: string[] = [];
      
      if (attendeeSessions && attendeeSessions.length > 0) {
        sessionIds = attendeeSessions.map(a => a.session_id);
      } else {
        // Fallback: get sessions from enrollments
        console.log("No attendee sessions found, checking enrollments...");
        const { data: enrollments, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id);
          
        if (enrollmentsError) {
          console.error("Error fetching enrollments:", enrollmentsError);
          return [];
        }
        
        if (!enrollments || enrollments.length === 0) {
          console.log("No enrollments found");
          return [];
        }
        
        const courseIds = enrollments.map(e => e.course_id);
        console.log("Checking course sessions for courses:", courseIds);
        
        // Get sessions for enrolled courses
        const { data: courseSessions, error: courseSessionsError } = await supabase
          .from('sessions')
          .select('id')
          .in('course_id', courseIds)
          .gt('end_time', currentTime) // Only future sessions
          .in('status', ['scheduled', 'in_progress']);
          
        if (courseSessionsError) {
          console.error("Error fetching course sessions:", courseSessionsError);
          return [];
        }
        
        sessionIds = courseSessions?.map(s => s.id) || [];
      }
      
      if (sessionIds.length === 0) {
        console.log("No session IDs found");
        return [];
      }
      
      console.log("Fetching sessions with IDs:", sessionIds);
      
      // Fetch the actual session details
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('id', sessionIds)
        .gt('end_time', currentTime) // Only sessions that haven't ended
        .in('status', ['scheduled', 'in_progress'])
        .order('start_time', { ascending: true })
        .limit(20);
        
      if (error) {
        console.error("Error fetching sessions:", error);
        throw error;
      }
      
      console.log("Final upcoming sessions data:", data);
      
      // Additional client-side filtering to ensure truly upcoming sessions
      const filteredData = (data || []).filter(session => {
        const sessionEnd = new Date(session.end_time);
        const isUpcoming = sessionEnd > now;
        
        console.log("Client-side filtering session:", {
          sessionId: session.id,
          title: session.title,
          endTime: session.end_time,
          isUpcoming
        });
        
        return isUpcoming;
      });
      
      console.log("Final filtered sessions count:", filteredData.length);
      return filteredData;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds to keep data fresh
  });
};
