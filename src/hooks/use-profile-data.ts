
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
      
      // Filter out any fields that don't exist in the database
      const validFields = [
        'first_name', 'last_name', 'display_name', 'gender', 
        'date_of_birth', 'city', 'state', 'country', 'bio',
        'experience', 'years_of_experience', 'intro_video_url',
        'subjects_interested', 'certificates', 'avatar_url',
        'profile_completed', 'updated_at', 'education_level', 
        'study_preferences', 'exam_history', 'course_link',
        'school_name', 'grade_level'
      ];
      
      // Filter the profileData to only include valid fields
      const filteredData = Object.keys(profileData)
        .filter(key => validFields.includes(key) && profileData[key] !== undefined)
        .reduce((obj: any, key) => {
          obj[key] = profileData[key];
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
          const metadata = { ...user.user_metadata };
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
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
      });
    }
  });
};
