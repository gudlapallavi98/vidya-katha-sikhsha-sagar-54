
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAvailabilityManager = () => {
  const cancelExpiredAvailabilities = async () => {
    try {
      const today = new Date();
      const { data: expiredAvailabilities, error: fetchError } = await supabase
        .from("teacher_availability")
        .select("*")
        .eq("status", "available")
        .lt("available_date", today.toISOString().split("T")[0]);

      if (fetchError) {
        console.error("Error fetching expired availabilities:", fetchError);
        return;
      }

      if (expiredAvailabilities && expiredAvailabilities.length > 0) {
        // Update all expired availabilities to 'expired'
        const { error: updateError } = await supabase
          .from("teacher_availability")
          .update({ status: "expired" })
          .in("id", expiredAvailabilities.map(avail => avail.id));

        if (updateError) {
          console.error("Error updating expired availabilities:", updateError);
        } else {
          console.log(`${expiredAvailabilities.length} expired availabilities have been updated`);
        }
      }
    } catch (error) {
      console.error("Error in cancelExpiredAvailabilities:", error);
    }
  };

  return { cancelExpiredAvailabilities };
};
