
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Course, Session, SessionRequest } from './types';

export const useTeacherCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher_courses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user?.id);
        
      if (error) throw error;
      return data as Course[];
    },
    enabled: !!user,
  });
};

export const useTeacherSessions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher_sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(title)
        `)
        .eq('teacher_id', user?.id)
        .order('start_time', { ascending: false });
        
      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user,
  });
};

export const useSessionRequests = (searchQuery = '') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['session_requests', user?.id, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('session_requests')
        .select(`
          *,
          student:profiles!session_requests_student_id_fkey(id, first_name, last_name),
          course:courses(title)
        `)
        .eq('teacher_id', user?.id)
        .eq('status', 'pending');

      if (searchQuery) {
        query = query.or(`student.first_name.ilike.%${searchQuery}%,student.last_name.ilike.%${searchQuery}%,course.title.ilike.%${searchQuery}%,proposed_title.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
        
      if (error) throw error;
      
      // Type assertion to ensure compatibility
      return (data as unknown) as SessionRequest[];
    },
    enabled: !!user,
  });
};
