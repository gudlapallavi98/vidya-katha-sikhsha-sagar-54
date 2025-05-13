
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Course } from '../types';

/**
 * Hook to fetch courses created by the logged in teacher
 */
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

/**
 * Hook to fetch all teachers
 */
export const useAllTeachers = () => {
  return useQuery({
    queryKey: ['all_teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'teacher');
        
      if (error) throw error;
      return data;
    },
  });
};

/**
 * Hook to fetch a specific teacher by ID
 */
export const useTeacherProfile = (teacherId: string) => {
  return useQuery({
    queryKey: ['teacher_profile', teacherId],
    queryFn: async () => {
      if (!teacherId) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', teacherId)
        .eq('role', 'teacher')
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!teacherId,
  });
};
