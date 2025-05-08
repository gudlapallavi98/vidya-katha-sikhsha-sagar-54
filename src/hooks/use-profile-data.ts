
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useUserProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user_profile', user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      if (!user) throw new Error("User not authenticated");
      
      console.log("Updating profile with data:", profileData);
      
      // Filter out any undefined or null fields to prevent overwriting with null
      const filteredData = Object.entries(profileData)
        .filter(([_, value]) => value !== undefined && value !== null)
        .reduce((obj: any, [key, value]) => {
          obj[key] = value;
          return obj;
        }, {});
      
      console.log("Filtered profile data:", filteredData);
      
      // Check if there's data to update
      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields to update");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(filteredData)
        .eq('id', user.id)
        .select();
      
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      console.log("Profile updated successfully:", data);

      // Also update auth.users metadata to ensure name consistency across the app
      if (filteredData.first_name || filteredData.last_name) {
        try {
          const userMetadata = user.user_metadata || {};
          const metadata = { ...userMetadata };
          
          if (filteredData.first_name) metadata.first_name = filteredData.first_name;
          if (filteredData.last_name) metadata.last_name = filteredData.last_name;

          const { error: authError } = await supabase.auth.updateUser({
            data: metadata
          });

          if (authError) {
            console.error("Failed to update auth metadata:", authError);
            // Don't throw error here, we want the profile update to succeed even if the auth update fails
          }
        } catch (metadataError) {
          console.error("Error updating metadata:", metadataError);
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', user?.id] });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      throw error; // Re-throw to let the component handle it
    }
  });
};
