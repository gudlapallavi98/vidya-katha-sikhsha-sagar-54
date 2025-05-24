
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface Subject {
  id: string;
  name: string;
}

interface Availability {
  id: string;
  subject_id: string;
  subject: Subject;
  available_date: string;
  start_time: string;
  end_time: string;
  status: string;
  auto_cancel_at?: string;
}

export const useAvailabilityData = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("profile_completed")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Error checking profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not check profile status"
          });
        } else {
          setIsProfileComplete(data?.profile_completed || false);
        }
      } catch (err) {
        console.error("Error in profile check:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkProfile();
  }, [user]);

  // Fetch teacher's subjects
  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      if (!user) return;

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("subjects_interested")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile subjects:", profileError);
          return;
        }

        const subjectNames = profileData?.subjects_interested || [];

        if (subjectNames.length === 0) return;

        const { data, error } = await supabase
          .from("subjects")
          .select("*")
          .in("name", subjectNames);

        if (error) {
          console.error("Error fetching subjects:", error);
          return;
        }

        setSubjects(data || []);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      }
    };

    fetchTeacherSubjects();
  }, [user]);

  const fetchAvailabilities = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("teacher_availability")
        .select(`
          *,
          subject:subjects(id, name)
        `)
        .eq("teacher_id", user.id);

      if (error) {
        console.error("Error fetching availabilities:", error);
        return;
      }

      setAvailabilities(data || []);
    } catch (err) {
      console.error("Error in fetchAvailabilities:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAvailabilities();
    }
  }, [user]);

  return {
    subjects,
    availabilities,
    isProfileComplete,
    isLoading,
    fetchAvailabilities,
  };
};
