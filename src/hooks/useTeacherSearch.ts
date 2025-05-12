
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
    experience?: string;
    avatar_url?: string;
  };
}

interface FilterOptions {
  searchQuery?: string;
  subjectId?: string;
  dateRange?: { 
    from?: Date;
    to?: Date;
  };
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  sortBy?: 'name' | 'date';
}

export const useTeacherSearch = (filterOptions: FilterOptions = {}) => {
  const [teachers, setTeachers] = useState<TeacherAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      if (
        filterOptions.searchQuery && 
        filterOptions.searchQuery.length < 2 && 
        filterOptions.searchQuery.length > 0
      ) return;
      
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('teacher_availability')
          .select(`
            *,
            subject:subjects(id, name),
            teacher:profiles(id, first_name, last_name, bio, experience, avatar_url)
          `)
          .eq('status', 'available')
          .gte('available_date', new Date().toISOString().split('T')[0]);

        // Apply search query filter
        if (filterOptions.searchQuery && filterOptions.searchQuery.length >= 2) {
          // Search by teacher name or subject name
          query = query.or(`teacher.first_name.ilike.%${filterOptions.searchQuery}%,teacher.last_name.ilike.%${filterOptions.searchQuery}%,subject.name.ilike.%${filterOptions.searchQuery}%`);
        }

        // Apply subject filter
        if (filterOptions.subjectId) {
          query = query.eq('subject_id', filterOptions.subjectId);
        }

        // Apply date range filter
        if (filterOptions.dateRange) {
          if (filterOptions.dateRange.from) {
            const fromDate = filterOptions.dateRange.from.toISOString().split('T')[0];
            query = query.gte('available_date', fromDate);
          }
          
          if (filterOptions.dateRange.to) {
            const toDate = filterOptions.dateRange.to.toISOString().split('T')[0];
            query = query.lte('available_date', toDate);
          }
        }

        // Apply sorting
        if (filterOptions.sortBy === 'name') {
          query = query.order('teacher(last_name)', { ascending: true });
        } else if (filterOptions.sortBy === 'date') {
          query = query.order('available_date', { ascending: true });
        } else {
          // Default sorting by date
          query = query.order('available_date', { ascending: true });
        }

        const { data, error } = await query;

        if (error) throw error;
        
        // Filter by experience level if needed
        let filteredData = data || [];
        if (filterOptions.experienceLevel && filteredData.length > 0) {
          // This is a simple implementation - in real life, you might want to have more
          // precise criteria for determining experience level
          filteredData = filteredData.filter(item => {
            const experience = item.teacher?.experience?.toLowerCase() || '';
            
            switch(filterOptions.experienceLevel) {
              case 'beginner':
                return experience.includes('beginner') || experience.includes('new') || 
                      experience.includes('1 year') || experience.includes('one year');
              case 'intermediate':
                return experience.includes('intermediate') || experience.includes('2 year') ||
                      experience.includes('two year') || experience.includes('3 year');
              case 'advanced':
                return experience.includes('advanced') || experience.includes('expert') ||
                      experience.includes('senior') || experience.includes('5 year');
              default:
                return true;
            }
          });
        }
        
        setTeachers(filteredData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching teachers');
        console.error('Error fetching teachers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, [filterOptions]);

  return { teachers, isLoading, error };
};
