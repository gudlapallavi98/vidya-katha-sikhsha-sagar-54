
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser } from '@/components/types/admin';

/**
 * Custom hook to fetch users for admin dashboard
 */
export const useAdminUsers = (searchQuery = '', roleFilter = '') => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin_users', searchQuery, roleFilter],
    queryFn: async () => {
      // Verify the user is an admin
      if (!user) throw new Error('Not authenticated');
      
      const { data: currentUserData, error: currentUserError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (currentUserError) throw currentUserError;
      if (currentUserData.role !== 'admin') throw new Error('Unauthorized: admin access required');
      
      // Check if the 'email' column exists in the profiles table
      const { data: columnsData } = await supabase
        .from('profiles')
        .select()
        .limit(1);
      
      // Define fields to select based on available columns
      const hasEmailColumn = columnsData?.[0] && 'email' in columnsData[0];
      let selectFields = 'id, first_name, last_name, role, created_at';
      
      if (hasEmailColumn) {
        selectFields += ', email';
      }
      
      // Build the query
      let query = supabase.from('profiles').select(selectFields);
      
      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
        if (hasEmailColumn) {
          query = query.or(`email.ilike.%${searchQuery}%`);
        }
      }
      
      // Apply role filter if provided
      if (roleFilter) {
        query = query.eq('role', roleFilter);
      }
      
      // Order by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (!data) return [] as AdminUser[];
      
      // Process data safely
      return data.map(user => createSafeUserObject(user, hasEmailColumn));
    },
    enabled: !!user,
  });
};
