
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserProfile } from "@/hooks/use-profile-data";
import { ZodSchema, z } from "zod";

export const useProfileFormData = (formSchema: ZodSchema) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [certificates, setCertificates] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Initialize form
  const form = useForm({
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
      years_of_experience: "",
      intro_video_url: "",
      education_level: "",
    },
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  // Log profile data for debugging
  useEffect(() => {
    if (profile) {
      console.log("Profile data loaded:", profile);
    }
  }, [profile]);

  // Update form when profile is loaded
  useEffect(() => {
    if (profile && !profileLoading) {
      console.log("Resetting form with profile data");
      
      // Handle date conversion for date_of_birth
      let dob = undefined;
      if (profile.date_of_birth) {
        try {
          dob = new Date(profile.date_of_birth);
          // Check if date is valid
          if (isNaN(dob.getTime())) {
            console.log("Invalid date format:", profile.date_of_birth);
            dob = undefined;
          }
        } catch (error) {
          console.error("Error converting date:", error);
          dob = undefined;
        }
      }
      
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        display_name: profile.display_name || "",
        gender: profile.gender || "",
        date_of_birth: dob,
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        bio: profile.bio || "",
        experience: profile.experience || "",
        years_of_experience: profile.years_of_experience || "",
        intro_video_url: profile.intro_video_url || "",
        education_level: profile.education_level || "",
      });

      setSelectedSubjects(profile.subjects_interested || []);
      setCertificates(profile.certificates || []);
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile, profileLoading, form]);

  return {
    form,
    selectedSubjects,
    setSelectedSubjects,
    certificates,
    setCertificates,
    avatarUrl,
    setAvatarUrl
  };
};
