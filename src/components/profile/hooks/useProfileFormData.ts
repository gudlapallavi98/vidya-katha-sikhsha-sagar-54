
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email?: string | undefined;
  role: "student" | "teacher";
  bio?: string;
  profile_picture?: string;
  subjects_interested?: string[];
  years_of_experience?: string;
  education_level?: string;
  certificates?: string[];
  avatar_url?: string;
  display_name?: string;
  gender?: string;
  date_of_birth?: string;
  city?: string;
  state?: string;
  country?: string;
  experience?: string;
  intro_video_url?: string;
  study_preferences?: string[];
  exam_history?: any;
  school_name?: string;
  grade_level?: string;
}

export function useProfileFormData(formSchema: any) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [teacherBio, setTeacherBio] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [certificates, setCertificates] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [studyPreferences, setStudyPreferences] = useState<string[]>([]);
  const [examHistory, setExamHistory] = useState<{name: string, date: string, score: string}[]>([]);

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
      school_name: "",
      grade_level: "",
    },
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        if (data) {
          // Cast data properly with optional email
          const profileData = { 
            ...data, 
            email: user.email || undefined 
          } as ProfileData;
          
          // Set the form values
          form.reset({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            display_name: profileData.display_name || "",
            gender: profileData.gender || "",
            date_of_birth: profileData.date_of_birth ? new Date(profileData.date_of_birth) : undefined,
            city: profileData.city || "",
            state: profileData.state || "",
            country: profileData.country || "",
            bio: profileData.bio || "",
            experience: profileData.experience || "",
            years_of_experience: profileData.years_of_experience || "",
            intro_video_url: profileData.intro_video_url || "",
            education_level: profileData.education_level || "",
            school_name: profileData.school_name || "",
            grade_level: profileData.grade_level || "",
          });
          
          // Set state values
          setFirstName(profileData.first_name);
          setLastName(profileData.last_name);
          if (profileData.email) setEmail(profileData.email);
          setAvatarUrl(profileData.avatar_url || null);
          setSelectedSubjects(profileData.subjects_interested || []);
          setStudyPreferences(profileData.study_preferences || []);
          
          // Handle exam history
          if (profileData.exam_history && Array.isArray(profileData.exam_history)) {
            setExamHistory(profileData.exam_history);
          }
          
          // Set teacher-specific fields
          setTeacherBio(profileData.bio || "");
          setYearsOfExperience(profileData.years_of_experience || "");
          setEducationLevel(profileData.education_level || "");
          setCertificates(profileData.certificates || []);

          console.log("Profile data loaded successfully");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, form]);

  return {
    form,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    avatarUrl,
    setAvatarUrl,
    teacherBio,
    setTeacherBio,
    yearsOfExperience,
    setYearsOfExperience,
    educationLevel,
    setEducationLevel,
    certificates,
    setCertificates,
    selectedSubjects,
    setSelectedSubjects,
    studyPreferences,
    setStudyPreferences,
    examHistory,
    setExamHistory,
  };
}
