import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AvailabilityForm from "./AvailabilityForm";
import { AvailabilityList } from "./AvailabilityList";

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
}

export function AvailabilityScheduler() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  // Check if profile is complete
  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_completed")
        .eq("id", user.id)
        .single();
        
      if (error) {
        console.error("Error checking profile:", error);
        return;
      }
      
      setIsProfileComplete(data?.profile_completed || false);
    };
    
    checkProfile();
  }, [user]);

  // Fetch teacher's subjects
  useEffect(() => {
    const fetchTeacherSubjects = async () => {
      if (!user) return;

      // Get teacher's interested subjects
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

      // Get subject details
      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .in("name", subjectNames);

      if (error) {
        console.error("Error fetching subjects:", error);
        return;
      }

      setSubjects(data || []);
    };

    fetchTeacherSubjects();
  }, [user]);

  // Fetch existing availabilities
  const fetchAvailabilities = async () => {
    if (!user) return;

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
  };

  // Initial fetch of availabilities
  useEffect(() => {
    fetchAvailabilities();
  }, [user]);

  // Handler for when a new availability is added
  const handleAvailabilityAdded = () => {
    fetchAvailabilities();
  };

  // Handler for when an availability is removed
  const handleAvailabilityRemoved = () => {
    fetchAvailabilities();
  };

  return (
    <div className="space-y-8">
      <AvailabilityForm 
        subjects={subjects} 
        onAvailabilityCreated={handleAvailabilityAdded}
      />
      <AvailabilityList 
        availabilities={availabilities} 
        onAvailabilityRemoved={handleAvailabilityRemoved} 
      />
    </div>
  );
}

export default AvailabilityScheduler;
