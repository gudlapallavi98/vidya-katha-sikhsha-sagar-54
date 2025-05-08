
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (profileData: any) => {
      if (!user) throw new Error("User not authenticated");
      
      // Filter out any fields that don't exist in the database
      // This prevents errors for fields like exam_history or education_level
      // that might not exist in the profiles table
      const validFields = [
        'first_name', 'last_name', 'display_name', 'gender', 
        'date_of_birth', 'city', 'state', 'country', 'bio',
        'experience', 'years_of_experience', 'intro_video_url',
        'subjects_interested', 'certificates', 'avatar_url',
        'profile_completed', 'updated_at'
      ];
      
      // Filter the profileData to only include valid fields
      const filteredData = Object.keys(profileData)
        .filter(key => validFields.includes(key))
        .reduce((obj: any, key) => {
          obj[key] = profileData[key];
          return obj;
        }, {});
      
      const { error } = await supabase
        .from('profiles')
        .update(filteredData)
        .eq('id', user.id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user_profile', user?.id] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  });
};
