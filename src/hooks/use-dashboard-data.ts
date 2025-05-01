
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Type definitions
interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  teacher_id: string;
  category: string;
  total_lessons: number;
}

interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  completed_lessons: number;
  last_accessed_at: string;
  course: Course;
}

interface Session {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  course?: Course;
}

interface Progress {
  course_id: string;
  completed_lessons: number;
  total_lessons: number;
}

interface SessionRequest {
  id: string;
  student_id: string;
  teacher_id: string;
  course_id: string;
  proposed_title: string;
  proposed_date: string;
  proposed_duration: number;
  status: 'pending' | 'approved' | 'rejected';
  request_message?: string;
  created_at: string;
  updated_at: string;
  student?: { id: string, first_name: string, last_name: string };
  course?: { id: string, title: string };
}

// Student dashboard hooks
export const useStudentEnrolledCourses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
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

export const useStudentUpcomingSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['upcoming_sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(*)
        `)
        .in('course_id', (await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id)).data?.map(e => e.course_id) || [])
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(5);
        
      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user,
  });
};

export const useStudentCompletedSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['completed_sessions', user?.id],
    queryFn: async () => {
      if (!user) return 0;
      
      const { count, error } = await supabase
        .from('session_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', user.id)
        .eq('attended', true);
        
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user,
  });
};

// Teacher dashboard hooks
export const useTeacherCourses = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['teacher_courses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('teacher_id', user.id);
        
      if (error) throw error;
      return data as Course[];
    },
    enabled: !!user,
  });
};

export const useTeacherSessionRequests = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['session_requests', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('session_requests')
        .select(`
          *,
          student:profiles(id, first_name, last_name),
          course:courses(id, title)
        `)
        .eq('teacher_id', user.id)
        .eq('status', 'pending');
        
      if (error) throw error;
      return data as SessionRequest[];
    },
    enabled: !!user,
  });
};

export const useTeacherUpcomingSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['teacher_upcoming_sessions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('teacher_id', user.id)
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true });
        
      if (error) throw error;
      return data as Session[];
    },
    enabled: !!user,
  });
};

export const useTeacherTotalSessions = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['teacher_total_sessions', user?.id],
    queryFn: async () => {
      if (!user) return { completed: 0, upcoming: 0 };
      
      const [completedResult, upcomingResult] = await Promise.all([
        supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', user.id)
          .eq('status', 'completed'),
        supabase
          .from('sessions')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', user.id)
          .in('status', ['scheduled', 'in_progress'])
      ]);
        
      return { 
        completed: completedResult.count || 0, 
        upcoming: upcomingResult.count || 0 
      };
    },
    enabled: !!user,
  });
};
