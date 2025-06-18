
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useStudentCompletedSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student_completed_sessions', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      // Get completed sessions count for student
      const { data: sessions, error } = await supabase
        .from('sessions')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed');
        
      if (error) {
        console.error('Error fetching completed sessions:', error);
        return 0;
      }
      
      // Also check session_attendees table for sessions the student attended
      const { data: attendedSessions, error: attendeeError } = await supabase
        .from('session_attendees')
        .select(`
          session_id,
          sessions!inner(status)
        `, { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('attended', true)
        .eq('sessions.status', 'completed');
        
      if (attendeeError) {
        console.error('Error fetching attended sessions:', attendeeError);
        return sessions?.length || 0;
      }
      
      // Return the higher count (more accurate)
      return Math.max(sessions?.length || 0, attendedSessions?.length || 0);
    },
    enabled: !!user,
  });
};

export const useStudentAchievementPoints = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student_achievement_points', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      // Get student achievements and calculate points
      const { data: achievements, error } = await supabase
        .from('student_achievements')
        .select(`
          id,
          achievement:achievements(name)
        `)
        .eq('student_id', user.id);
        
      if (error) {
        console.error('Error fetching student achievements:', error);
        return 0;
      }
      
      // Calculate points based on number of achievements
      // For now, each achievement gives 50 points
      const basePoints = (achievements?.length || 0) * 50;
      
      // Get completed sessions for bonus points
      const { data: completedSessions, error: sessionError } = await supabase
        .from('session_attendees')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('attended', true);
        
      if (sessionError) {
        console.error('Error fetching completed sessions for points:', sessionError);
        return basePoints;
      }
      
      // Add 10 points per completed session
      const sessionPoints = (completedSessions?.length || 0) * 10;
      
      // Get enrollment count for bonus points
      const { data: enrollments, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('student_id', user.id);
        
      if (enrollmentError) {
        console.error('Error fetching enrollments for points:', enrollmentError);
        return basePoints + sessionPoints;
      }
      
      // Add 25 points per course enrollment
      const enrollmentPoints = (enrollments?.length || 0) * 25;
      
      return basePoints + sessionPoints + enrollmentPoints;
    },
    enabled: !!user,
  });
};
