
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
