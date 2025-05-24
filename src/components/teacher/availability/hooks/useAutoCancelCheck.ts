
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Availability {
  id: string;
  auto_cancel_at?: string;
  status: string;
}

export const useAutoCancelCheck = (
  availabilities: Availability[],
  fetchAvailabilities: () => void
) => {
  const { user } = useAuth();

  useEffect(() => {
    const checkForAutoCancellations = async () => {
      if (!user) return;
      
      try {
        const now = new Date().toISOString();
        
        const toCancelAvailabilities = availabilities.filter(avail => 
          avail.auto_cancel_at && avail.auto_cancel_at <= now && avail.status === "available"
        );
        
        if (toCancelAvailabilities.length > 0) {
          for (const avail of toCancelAvailabilities) {
            await supabase
              .from("teacher_availability")
              .update({ status: "cancelled" })
              .eq("id", avail.id)
              .eq("teacher_id", user.id);
          }
          
          fetchAvailabilities();
        }
      } catch (err) {
        console.error("Error in auto-cancel check:", err);
      }
    };
    
    const intervalId = setInterval(checkForAutoCancellations, 60000);
    checkForAutoCancellations();
    
    return () => clearInterval(intervalId);
  }, [availabilities, user, fetchAvailabilities]);
};
