
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Session } from '../types';

/**
 * Hook to fetch upcoming sessions for a student
 */
export const useStudentUpcomingSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['upcoming_sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const currentTime = new Date().toISOString();
      
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
          .gt('start_time', currentTime)
          .order('start_time', { ascending: true })
          .limit(10);
          
        if (error) throw error;
        
        // Add display_status to each session
        return (data || []).map(session => ({
          ...session,
          display_status: 'upcoming'
        })) as Session[];
      }
      
      // If we have session attendees, fetch those specific sessions
      const sessionIds = attendeeSessions.map(a => a.session_id);
      
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
        
      if (upcomingError) throw upcomingError;
      
      // Then, fetch completed or past sessions
      const { data: pastSessions, error: pastError } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .in('id', sessionIds)
        .lte('end_time', currentTime)  // Sessions that have ended
        .order('start_time', { ascending: false })
        .limit(5);
        
      if (pastError) throw pastError;
      
      // Combine the results, with proper status indicators
      const upcomingWithStatus = (upcomingSessions || []).map(session => ({
        ...session,
        display_status: 'upcoming'
      }));
      
      const pastWithStatus = (pastSessions || []).map(session => {
        // Check if the student attended this session
        const displayStatus = session.status === 'completed' ? 'completed' : 'missed';
        return {
          ...session,
          display_status: displayStatus
        };
      });
      
      return [...upcomingWithStatus, ...pastWithStatus] as Session[];
    },
    enabled: !!user,
  });
};

/**
 * Hook to fetch past sessions for a student
 */
export const useStudentPastSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['past_sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const currentTime = new Date().toISOString();
      
      // Get sessions where the student is an attendee
      const { data: attendeeSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select('session_id, join_time')
        .eq('student_id', user.id);
        
      if (attendeeError) throw attendeeError;
      
      if (!attendeeSessions || attendeeSessions.length === 0) {
        return [];
      }
      
      const sessionIds = attendeeSessions.map(a => a.session_id);
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
        
      if (error) throw error;
      
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
    enabled: !!user,
  });
};
