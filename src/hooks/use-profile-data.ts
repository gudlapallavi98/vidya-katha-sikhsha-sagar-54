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
      
      // Handle date_of_birth conversion
      let mappedData = { ...profileData };
      
      // Convert Date object to ISO string for date_of_birth
      if (mappedData.date_of_birth && mappedData.date_of_birth instanceof Date) {
        // Convert to YYYY-MM-DD format for proper database storage
        const year = mappedData.date_of_birth.getFullYear();
        const month = (mappedData.date_of_birth.getMonth() + 1).toString().padStart(2, '0');
        const day = mappedData.date_of_birth.getDate().toString().padStart(2, '0');
        mappedData.date_of_birth = `${year}-${month}-${day}`;
        console.log("Converted date_of_birth to:", mappedData.date_of_birth);
      }
      
      // Map experience fields to match the database schema
      if (mappedData.years_of_experience) {
        mappedData.experience = mappedData.experience || '';
        
        if (!mappedData.experience) {
          mappedData.experience = `${mappedData.years_of_experience} years of experience`;
        }
        
        delete mappedData.years_of_experience;
      }
      
      // Handle study_preferences array properly
      if (mappedData.study_preferences && Array.isArray(mappedData.study_preferences)) {
        console.log("Saving study_preferences:", mappedData.study_preferences);
      }
      
      // Handle exam_history array properly
      if (mappedData.exam_history && Array.isArray(mappedData.exam_history)) {
        console.log("Saving exam_history:", mappedData.exam_history);
      }
      
      // Filter out any undefined or null fields, but keep empty arrays and empty strings
      const filteredData = Object.entries(mappedData)
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
          }
        } catch (metadataError) {
          console.error("Error updating metadata:", metadataError);
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', user?.id] });
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Failed to update profile",
        description: error.message || "Please try again"
      });
    }
  });
};
