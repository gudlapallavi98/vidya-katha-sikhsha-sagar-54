
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/use-profile-data";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { FileUpload } from "@/components/ui/file-upload";
import BasicInfoSection from "./form-sections/BasicInfoSection";
import LocationSection from "./form-sections/LocationSection";
import BioSection from "./form-sections/BioSection";
import SubjectsSection from "./form-sections/SubjectsSection";
import TeacherSection from "./form-sections/TeacherSection";

interface ProfileFormProps {
  role: "student" | "teacher";
  onCompleted?: () => void;
}

// Schema definition
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

export function ProfileForm({ role, onCompleted }: ProfileFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      display_name: "",
      gender: "",
      date_of_birth: undefined,
      city: "",
      state: "",
      country: "",
      bio: "",
      experience: "",
      intro_video_url: "",
      subjects_interested: [],
      avatar_url: "",
    },
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Update form when profile is loaded
  useEffect(() => {
    if (profile && !profileLoading) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        display_name: profile.display_name || "",
        gender: profile.gender || "",
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : undefined,
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        bio: profile.bio || "",
        experience: profile.experience || "",
        intro_video_url: profile.intro_video_url || "",
        subjects_interested: profile.subjects_interested || [],
        avatar_url: profile.avatar_url || "",
      });

      setSelectedSubjects(profile.subjects_interested || []);
      setCertificates(profile.certificates || []);
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile, profileLoading, form]);

  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Format date_of_birth to ISO string if it exists
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

      // Update profile with formatted values
      const { error } = await supabase
        .from("profiles")
        .update(formattedData)
        .eq("id", user.id);

      if (error) {
        throw error;
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
          <div className="flex justify-center mb-6">
            <FileUpload 
              onUploadComplete={handleAvatarUpload} 
              currentImageUrl={avatarUrl} 
              userId={user.id}
            />
          </div>
        )}
        
        <BasicInfoSection form={form} />
        <LocationSection form={form} />
        <BioSection form={form} />
        <SubjectsSection 
          selectedSubjects={selectedSubjects} 
          setSelectedSubjects={setSelectedSubjects} 
        />
        
        {role === "teacher" && (
          <TeacherSection 
            form={form} 
            certificates={certificates} 
            setCertificates={setCertificates} 
          />
        )}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
