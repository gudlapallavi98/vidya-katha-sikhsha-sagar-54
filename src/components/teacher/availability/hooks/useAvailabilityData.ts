
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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch teacher's subjects
  const fetchTeacherSubjects = async () => {
    if (!user) return;

    try {
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

      if (subjectNames.length === 0) {
        setSubjects([]);
        return;
      }

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
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  };

  // Fetch existing availabilities
  const fetchAvailabilities = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("teacher_availability")
        .select(`
          *,
          subject:subjects(id, name)
        `)
        .eq("teacher_id", user.id)
        .order("available_date", { ascending: true });

      if (error) {
        console.error("Error fetching availabilities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load availabilities"
        });
        return;
      }

      console.log("Fetched availabilities:", data);
      setAvailabilities(data || []);
    } catch (err) {
      console.error("Error in fetchAvailabilities:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetching
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        await Promise.all([
          fetchTeacherSubjects(),
          fetchAvailabilities()
        ]);
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Set up real-time subscription for availabilities
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('teacher_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teacher_availability',
          filter: `teacher_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Availability change received:', payload);
          // Refetch availabilities when changes occur
          fetchAvailabilities();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    subjects,
    availabilities,
    isLoading,
    fetchAvailabilities,
    fetchTeacherSubjects,
  };
};
