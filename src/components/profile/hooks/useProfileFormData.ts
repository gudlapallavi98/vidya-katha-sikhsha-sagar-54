import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "student" | "teacher";
  bio?: string;
  profile_picture?: string;
  subjects_interested?: string[];
  years_of_experience?: string;
  education_level?: string;
  certificates?: string[];
}

export function useProfileFormData(role: "student" | "teacher") {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [teacherBio, setTeacherBio] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [certificates, setCertificates] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

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
          const profileData = data as ProfileData;
          setFirstName(profileData.first_name);
          setLastName(profileData.last_name);
          setEmail(profileData.email);
          setProfilePicture(profileData.profile_picture || null);
          setSelectedSubjects(profileData.subjects_interested || []);

          // Fix types for teacher-specific fields by checking if they exist in the profile data
          if (role === "teacher") {
            if ("years_of_experience" in profileData) {
              setYearsOfExperience(profileData.years_of_experience as string || "");
            }
            
            if ("education_level" in profileData) {
              setEducationLevel(profileData.education_level as string || "");
            }
            
            // Continue with existing code
            setTeacherBio(profileData.bio || "");
            setCertificates(profileData.certificates || []);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (user) {
      fetchProfileData();
    }
  }, [user, role]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    profilePicture,
    setProfilePicture,
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
  };
}
