
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/components/types/admin";

/**
 * Hook to fetch admin users with optional search query and limit
 * @param searchQuery - Optional search term
 * @param limit - Optional limit on number of results, defaults to 10
 */
export const useAdminUsers = (searchQuery: string = "", limit: number = 10) => {
  return useQuery({
    queryKey: ['adminUsers', searchQuery, limit],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, email, role, created_at')
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data as AdminUser[];
    }
  });
};
