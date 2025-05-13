
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TeacherSearchParams {
  searchQuery?: string;
  subjectId?: string;
  dateRange?: { from: Date; to?: Date } | undefined;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  sortBy?: "date" | "name";
}

export const useTeacherSearch = ({
  searchQuery = '',
  subjectId = '',
  dateRange,
  experienceLevel,
  sortBy = 'date'
}: TeacherSearchParams) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Build the base query
        let query = supabase
          .from('teacher_availability')
          .select(`
            id,
            teacher_id,
            available_date,
            start_time,
            end_time,
            subject_id,
            subject:subjects(name),
            teacher:profiles(id, first_name, last_name, bio, avatar_url, experience)
          `)
          .eq('status', 'available');

        // Apply subject filter
        if (subjectId) {
          query = query.eq('subject_id', subjectId);
        }

        // Apply date range filter
        if (dateRange?.from) {
          const fromDateStr = dateRange.from.toISOString().split('T')[0];
          query = query.gte('available_date', fromDateStr);
          
          if (dateRange.to) {
            const toDateStr = dateRange.to.toISOString().split('T')[0];
            query = query.lte('available_date', toDateStr);
          }
        }

        // Handle search query - apply filtering after the data is retrieved
        let { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Filter by search query after data is retrieved
        if (searchQuery && data) {
          const lowerSearchQuery = searchQuery.toLowerCase();
          data = data.filter(item => 
            item.teacher.first_name.toLowerCase().includes(lowerSearchQuery) ||
            item.teacher.last_name.toLowerCase().includes(lowerSearchQuery) ||
            item.subject.name.toLowerCase().includes(lowerSearchQuery)
          );
        }

        // Filter by experience level
        if (experienceLevel && data) {
          data = data.filter(item => item.teacher.experience === experienceLevel);
        }

        // Sort the data
        if (data) {
          if (sortBy === 'name') {
            data.sort((a, b) => 
              `${a.teacher.first_name} ${a.teacher.last_name}`.localeCompare(
                `${b.teacher.first_name} ${b.teacher.last_name}`
              )
            );
          } else {
            // Default sort by date
            data.sort((a, b) => 
              new Date(a.available_date).getTime() - new Date(b.available_date).getTime()
            );
          }
        }

        setTeachers(data || []);
      } catch (err: any) {
        console.error("Error fetching teachers:", err);
        setError(err);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch teachers. Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Add some debounce for search queries
    const timeoutId = setTimeout(() => {
      fetchTeachers();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, subjectId, dateRange, experienceLevel, sortBy, toast]);

  return { teachers, isLoading, error };
};
