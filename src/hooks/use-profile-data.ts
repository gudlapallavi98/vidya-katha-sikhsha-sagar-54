
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
      
      // Handle date_of_birth conversion - ensure it stays as the selected date
      let mappedData = { ...profileData };
      
      if (mappedData.date_of_birth && mappedData.date_of_birth instanceof Date) {
        // Create date string in YYYY-MM-DD format using the exact date components
        // This prevents timezone shifts by working with local date components
        const year = mappedData.date_of_birth.getFullYear();
        const month = String(mappedData.date_of_birth.getMonth() + 1).padStart(2, '0');
        const day = String(mappedData.date_of_birth.getDate()).padStart(2, '0');
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

      // Handle session_format preference - ensure it's included in the update
      if (mappedData.session_format !== undefined) {
        console.log("Saving session_format:", mappedData.session_format);
      }
      
      // Explicitly handle location fields - ensure they're always included
      const locationFields = ['city', 'state', 'country'];
      locationFields.forEach(field => {
        if (mappedData[field] !== undefined) {
          console.log(`Saving ${field}:`, mappedData[field]);
        }
      });
      
      // Create the update data object with explicit field mapping
      const updateData: any = {};
      
      // Always include these core fields
      const coreFields = [
        'first_name', 'last_name', 'display_name', 'gender', 'date_of_birth', 
        'bio', 'avatar_url', 'profile_completed', 'updated_at',
        'education_level', 'school_name', 'grade_level',
        'subjects_interested', 'study_preferences', 'exam_history',
        'experience', 'intro_video_url', 'session_format'
      ];
      
      // Always include location fields regardless of value
      const alwaysIncludeFields = ['city', 'state', 'country'];
      
      // Map all fields appropriately
      Object.keys(mappedData).forEach(key => {
        if (coreFields.includes(key) || alwaysIncludeFields.includes(key)) {
          updateData[key] = mappedData[key];
        }
      });
      
      console.log("Final mapped data for database update:", updateData);
      
      // Check if there's data to update
      if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select();
      
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      console.log("Profile updated successfully:", data);

      // Also update auth.users metadata to ensure name consistency across the app
      if (updateData.first_name || updateData.last_name) {
        try {
          const userMetadata = user.user_metadata || {};
          const metadata = { ...userMetadata };
          
          if (updateData.first_name) metadata.first_name = updateData.first_name;
          if (updateData.last_name) metadata.last_name = updateData.last_name;

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
