
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  subjects_interested?: string[];
  bio?: string;
  email?: string;
}

interface TeacherAvailability {
  id: string;
  teacher_id: string;
  subject_id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  status: string;
  session_type: string;
  max_students: number;
  price?: number;
  subject: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    bio?: string;
    email?: string;
    subjects_interested?: string[];
  };
}

export const useTeacherSearch = (searchQuery: string = '') => {
  const [teachers, setTeachers] = useState<TeacherAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (searchQuery.length < 2 && searchQuery.length > 0) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Get current date to filter future availability
        const currentDate = new Date().toISOString().split('T')[0];
        
        let query = supabase
          .from('teacher_availability')
          .select(`
            id,
            teacher_id,
            subject_id,
            available_date,
            start_time,
            end_time,
            status,
            session_type,
            max_students,
            price,
            subject:subjects(id, name),
            teacher:profiles!teacher_availability_teacher_id_fkey(
              id,
              first_name,
              last_name,
              bio,
              email,
              subjects_interested
            )
          `)
          .eq('status', 'available')
          .gte('available_date', currentDate)
          .order('available_date', { ascending: true });

        if (searchQuery.length >= 2) {
          // Search by teacher name or subject name
          query = query.or(`teacher.first_name.ilike.%${searchQuery}%,teacher.last_name.ilike.%${searchQuery}%,subject.name.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query.limit(50);

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        console.log('Fetched teacher availability:', data);
        setTeachers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching teachers');
        console.error('Error fetching teachers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [searchQuery]);

  return { teachers, isLoading, error };
};
