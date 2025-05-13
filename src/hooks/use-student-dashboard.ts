
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Enrollment, Progress, Session, StudentAchievement } from './types';

/**
 * Custom hook to fetch all student dashboard data in one place
 * This centralizes the data fetching for better error handling and loading states
 */
export const useStudentDashboard = () => {
  const { user } = useAuth();
  const userId = user?.id;

  // Fetch enrolled courses
  const enrollments = useQuery({
    queryKey: ['enrollments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('student_id', userId);
        
      if (error) {
        console.error("Error fetching enrollments:", error);
        throw error;
      }
      return data as Enrollment[];
    },
    enabled: !!userId,
  });

  // Fetch student progress
  const progress = useQuery({
    queryKey: ['progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('progress')
        .select(`
          *,
          lesson:lessons(*)
        `)
        .eq('student_id', userId);
        
      if (error) {
        console.error("Error fetching progress:", error);
        throw error;
      }
      return data as Progress[];
    },
    enabled: !!userId,
  });

  // Fetch upcoming sessions
  const upcomingSessions = useQuery({
    queryKey: ['upcoming_sessions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const currentTime = new Date().toISOString();
      
      // Get sessions where the student is an attendee
      const { data: attendeeSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select('session_id')
        .eq('student_id', userId);
        
      if (attendeeError) {
        console.error("Error fetching session attendees:", attendeeError);
        throw attendeeError;
      }
      
      if (!attendeeSessions || attendeeSessions.length === 0) {
        // Fallback to fetch from enrollments
        const { data: enrollmentData, error: enrollmentsError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', userId);
          
        if (enrollmentsError) {
          console.error("Error fetching enrollments:", enrollmentsError);
          throw enrollmentsError;
        }
        
        if (!enrollmentData || enrollmentData.length === 0) {
          return [];
        }
        
        const courseIds = enrollmentData.map(e => e.course_id);
        
        const { data, error } = await supabase
          .from('sessions')
          .select(`
            *,
            course:courses(title)
          `)
          .in('course_id', courseIds)
          .gt('start_time', currentTime)
          .order('start_time', { ascending: true })
          .limit(10);
          
        if (error) {
          console.error("Error fetching sessions:", error);
          throw error;
        }
        
        return (data || []).map(session => ({
          ...session,
          display_status: 'upcoming'
        })) as Session[];
      }
      
      // If we have session attendees, fetch those specific sessions
      const sessionIds = attendeeSessions.map(a => a.session_id);
      
      if (sessionIds.length === 0) return [];
      
      // First, fetch upcoming sessions
      const { data: upcomingSessions, error: upcomingError } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('id', sessionIds)
        .gt('start_time', currentTime)
        .order('start_time', { ascending: true });
        
      if (upcomingError) {
        console.error("Error fetching upcoming sessions:", upcomingError);
        throw upcomingError;
      }
      
      // Combine the results with proper status indicators
      const upcomingWithStatus = (upcomingSessions || []).map(session => ({
        ...session,
        display_status: 'upcoming'
      }));
      
      return upcomingWithStatus as Session[];
    },
    enabled: !!userId,
  });

  // Fetch past sessions
  const pastSessions = useQuery({
    queryKey: ['past_sessions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const currentTime = new Date().toISOString();
      
      // Get sessions where the student is an attendee
      const { data: attendeeSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select('session_id, join_time')
        .eq('student_id', userId);
        
      if (attendeeError) {
        console.error("Error fetching session attendees:", attendeeError);
        throw attendeeError;
      }
      
      if (!attendeeSessions || attendeeSessions.length === 0) {
        return [];
      }
      
      const sessionIds = attendeeSessions.map(a => a.session_id);
      
      if (sessionIds.length === 0) return [];
      
      const attendanceMap = attendeeSessions.reduce((acc, curr) => {
        acc[curr.session_id] = curr.join_time;
        return acc;
      }, {} as Record<string, string | null>);
      
      // Fetch past sessions
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('id', sessionIds)
        .lte('end_time', currentTime)  // Sessions that have ended
        .order('start_time', { ascending: false });
        
      if (error) {
        console.error("Error fetching past sessions:", error);
        throw error;
      }
      
      // Add status information based on attendance
      return (data || []).map(session => {
        const joinTime = attendanceMap[session.id];
        let status = 'missed';
        
        if (joinTime) {
          status = 'attended';
        } else if (session.status === 'cancelled') {
          status = 'cancelled';
        }
        
        return {
          ...session,
          display_status: status
        };
      }) as Session[];
    },
    enabled: !!userId,
  });

  // Fetch achievements
  const achievements = useQuery({
    queryKey: ['achievements', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('student_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('student_id', userId);
        
      if (error) {
        console.error("Error fetching achievements:", error);
        throw error;
      }
      return data as StudentAchievement[];
    },
    enabled: !!userId,
  });

  return {
    enrollments: {
      data: enrollments.data || [],
      isLoading: enrollments.isLoading,
      error: enrollments.error
    },
    progress: {
      data: progress.data || [],
      isLoading: progress.isLoading,
      error: progress.error
    },
    upcomingSessions: {
      data: upcomingSessions.data || [],
      isLoading: upcomingSessions.isLoading,
      error: upcomingSessions.error
    },
    pastSessions: {
      data: pastSessions.data || [],
      isLoading: pastSessions.isLoading,
      error: pastSessions.error
    },
    achievements: {
      data: achievements.data || [],
      isLoading: achievements.isLoading,
      error: achievements.error
    },
    isLoading: 
      enrollments.isLoading || 
      progress.isLoading || 
      upcomingSessions.isLoading || 
      pastSessions.isLoading || 
      achievements.isLoading,
    isError: 
      !!enrollments.error || 
      !!progress.error || 
      !!upcomingSessions.error || 
      !!pastSessions.error || 
      !!achievements.error
  };
};
