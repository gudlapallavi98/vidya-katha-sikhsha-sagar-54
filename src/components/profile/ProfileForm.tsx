
import { useState, useEffect } from "react";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useProfileFormData } from "./hooks/useProfileFormData";
import { ProfileAvatarSection } from "./form-sections/ProfileAvatarSection";
import { ProfileFormContent } from "./form-sections/ProfileFormContent";
import { useUserProfile } from "@/hooks/use-profile-data";

const formSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.date().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  experience: z.string().optional(),
  intro_video_url: z.string().url().optional().or(z.literal("")),
  subjects_interested: z.array(z.string()).optional(),
  avatar_url: z.string().optional(),
});

interface ProfileFormProps {
  role: "student" | "teacher";
  onCompleted?: () => void;
}

export function ProfileForm({ role, onCompleted }: ProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { data: existingProfile } = useUserProfile();
  
  const {
    form, 
    selectedSubjects, 
    setSelectedSubjects, 
    certificates, 
    setCertificates, 
    avatarUrl, 
    setAvatarUrl
  } = useProfileFormData(formSchema);

  // Pre-fill form with signup data and existing profile data
  useEffect(() => {
    if (user || existingProfile) {
      const userData = existingProfile || user;
      
      // Pre-fill basic info from signup
      form.setValue("first_name", userData?.first_name || user?.user_metadata?.first_name || "");
      form.setValue("last_name", userData?.last_name || user?.user_metadata?.last_name || "");
      
      // Pre-fill existing profile data
      if (existingProfile) {
        form.setValue("display_name", existingProfile.display_name || "");
        form.setValue("gender", existingProfile.gender || "");
        form.setValue("city", existingProfile.city || "");
        form.setValue("state", existingProfile.state || "");
        form.setValue("country", existingProfile.country || "");
        form.setValue("bio", existingProfile.bio || "");
        form.setValue("experience", existingProfile.experience || "");
        form.setValue("intro_video_url", existingProfile.intro_video_url || "");
        
        if (existingProfile.date_of_birth) {
          form.setValue("date_of_birth", new Date(existingProfile.date_of_birth));
        }
        
        if (existingProfile.subjects_interested) {
          setSelectedSubjects(existingProfile.subjects_interested);
        }
        
        if (existingProfile.certificates) {
          setCertificates(existingProfile.certificates);
        }
        
        if (existingProfile.avatar_url) {
          setAvatarUrl(existingProfile.avatar_url);
        }
      }
    }
  }, [user, existingProfile, form, setSelectedSubjects, setCertificates, setAvatarUrl]);

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const formattedData = {
        first_name: values.first_name,
        last_name: values.last_name,
        display_name: values.display_name,
        gender: values.gender,
        date_of_birth: values.date_of_birth ? values.date_of_birth.toISOString().split('T')[0] : null,
        city: values.city,
        state: values.state,
        country: values.country,
        bio: values.bio,
        experience: values.experience,
        intro_video_url: values.intro_video_url,
        subjects_interested: selectedSubjects,
        certificates: certificates,
        avatar_url: avatarUrl,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      };

      console.log("Updating profile with data:", formattedData);

      const { error } = await supabase
        .from("profiles")
        .update(formattedData)
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      // Update auth metadata
      if (values.first_name || values.last_name) {
        try {
          const metadata = { ...user.user_metadata };
          if (values.first_name) metadata.first_name = values.first_name;
          if (values.last_name) metadata.last_name = values.last_name;

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

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      if (onCompleted) {
        onCompleted();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      console.error("Profile update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {user && (
          <ProfileAvatarSection 
            avatarUrl={avatarUrl}
            userId={user.id}
            onAvatarUpload={handleAvatarUpload}
            userRole={role}
            userGender={form.watch("gender")}
          />
        )}
        
        <ProfileFormContent 
          form={form}
          role={role}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          certificates={certificates}
          setCertificates={setCertificates}
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
