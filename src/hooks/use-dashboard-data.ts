
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  total_lessons: number;
  teacher_id: string;
  teacher?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  completed_lessons: number;
  last_accessed_at: string;
  course: Course;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  duration: number;
  order_index: number;
  video_url: string | null;
  materials_url: string | null;
  created_at: string;
}

export interface Progress {
  id: string;
  student_id: string;
  lesson_id: string;
  course_id: string;
  completed: boolean;
  watched_duration: number;
  completed_at: string | null;
  last_watched_at: string;
  lesson?: Lesson;
}

export interface Session {
  id: string;
  course_id: string;
  teacher_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  course?: {
    title: string;
  };
}

export interface SessionRequest {
  id: string;
  student_id: string;
  teacher_id: string;
  course_id: string;
  proposed_title: string;
  proposed_date: string;
  proposed_duration: number;
  status: 'pending' | 'approved' | 'rejected';
  request_message: string;
  created_at: string;
  updated_at: string;
  student: {
    id: string;
    first_name: string;
    last_name: string;
  };
  course: {
    title: string;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  image_url: string | null;
  criteria: string;
}

export interface StudentAchievement {
  id: string;
  student_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

export const useStudentEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('student_id', user?.id);
        
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

// Add the missing function for student upcoming sessions
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
      return data as Session[];
    },
    enabled: !!user,
  });
};

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

export const useSessionRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['session_requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('session_requests')
        .select(`
          *,
          student:profiles!session_requests_student_id_fkey(id, first_name, last_name),
          course:courses(title)
        `)
        .eq('teacher_id', user?.id)
        .eq('status', 'pending');
        
      if (error) throw error;
      
      // Type assertion to ensure compatibility
      return (data as unknown) as SessionRequest[];
    },
    enabled: !!user,
  });
};
