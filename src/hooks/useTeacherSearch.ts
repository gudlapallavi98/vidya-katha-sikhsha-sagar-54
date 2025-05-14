
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  subjects_interested?: string[];
  bio?: string;
}

interface TeacherAvailability {
  id: string;
  teacher_id: string;
  subject_id: string;
  available_date: string;
  start_time: string;
  end_time: string;
  status: string;
  subject: {
    id: string;
    name: string;
  };
  teacher: {
    id: string;
    first_name: string;
    last_name: string;
    bio?: string;
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
        let query = supabase
          .from('teacher_availability')
          .select(`
            *,
            subject:subjects(id, name),
            teacher:profiles(id, first_name, last_name, bio)
          `)
          .eq('status', 'available')
          .gte('available_date', new Date().toISOString().split('T')[0]);

        if (searchQuery.length >= 2) {
          // Search by teacher name or subject name
          query = query.or(`teacher.first_name.ilike.%${searchQuery}%,teacher.last_name.ilike.%${searchQuery}%,subject.name.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;

        if (error) throw error;
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
