import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  subjects_interested?: string[];
  bio?: string;
  email?: string;
  experience?: string;
  avatar_url?: string;
  city?: string;
  country?: string;
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
  teacher: Teacher;
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
        // Get current date and time to filter future availability
        const now = new Date();
        const currentDate = now.toISOString().split('T')[0];
        const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
        
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
              subjects_interested,
              experience,
              avatar_url,
              city,
              country
            )
          `)
          .eq('status', 'available')
          .or(`available_date.gt.${currentDate},and(available_date.eq.${currentDate},start_time.gt.${currentTime})`)
          .order('available_date', { ascending: true })
          .order('start_time', { ascending: true });

        const { data, error } = await query.limit(50);

        if (error) {
          console.error('Database error:', error);
          throw error;
        }

        console.log('Fetched teacher availability:', data);
        
        // Filter out any records where the teacher data failed to load
        let validData = (data || []).filter(item => 
          item.teacher && 
          typeof item.teacher === 'object' && 
          'first_name' in item.teacher &&
          'last_name' in item.teacher
        ) as TeacherAvailability[];

        // Apply search filter if provided
        if (searchQuery.length >= 2) {
          const searchLower = searchQuery.toLowerCase();
          validData = validData.filter(item => {
            const teacherName = `${item.teacher.first_name} ${item.teacher.last_name}`.toLowerCase();
            const subjectName = item.subject?.name?.toLowerCase() || '';
            const teacherBio = item.teacher.bio?.toLowerCase() || '';
            const teacherSubjects = (item.teacher.subjects_interested || []).join(' ').toLowerCase();
            
            return teacherName.includes(searchLower) ||
                   subjectName.includes(searchLower) ||
                   teacherBio.includes(searchLower) ||
                   teacherSubjects.includes(searchLower);
          });
        }

        // Group by teacher and keep only the latest availability for each teacher
        const teacherMap = new Map<string, TeacherAvailability>();
        validData.forEach(item => {
          const existingItem = teacherMap.get(item.teacher_id);
          if (!existingItem || 
              new Date(item.available_date + 'T' + item.start_time) < new Date(existingItem.available_date + 'T' + existingItem.start_time)) {
            teacherMap.set(item.teacher_id, item);
          }
        });

        const latestAvailabilities = Array.from(teacherMap.values());
        
        setTeachers(latestAvailabilities);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching teachers');
        console.error('Error fetching teachers:', err);
        setTeachers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [searchQuery]);

  return { teachers, isLoading, error };
};
