
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminUser } from "@/components/types/admin";

/**
 * Hook to fetch admin users with optional search query and limit/role filter
 * @param searchQuery - Optional search term
 * @param limit - Optional limit on number of results, defaults to 10
 * @param roleFilter - Optional role to filter by
 */
export const useAdminUsers = (searchQuery: string = "", limit: number = 10, roleFilter: string = "") => {
  return useQuery({
    queryKey: ['adminUsers', searchQuery, limit, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, role, created_at');
      
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }
      
      // Apply role filter if provided
      if (roleFilter && roleFilter !== "all") {
        query = query.eq('role', roleFilter);
      }
      
      // Apply limit if provided
      if (limit) {
        query = query.limit(limit);
      }
      
      // Order by creation date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Transform the data to match AdminUser type
      return (data || []).map(user => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: `${user.first_name.toLowerCase()}.${user.last_name.toLowerCase()}@example.com`, // Generate placeholder email
        role: user.role,
        created_at: user.created_at
      })) as AdminUser[];
    }
  });
};
