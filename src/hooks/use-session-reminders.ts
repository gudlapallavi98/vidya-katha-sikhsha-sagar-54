import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, addHours } from "date-fns";
import { sendSessionNotification } from "@/utils/email-notification";

export const useSessionReminders = () => {
  const checkUpcomingSessionReminders = async () => {
    try {
      const now = new Date();
      const threeHoursLater = addHours(now, 3);
      
      // Format the date to ISO string but keep just the date part for comparison
      const today = now.toISOString().split("T")[0];
      
      // Get upcoming sessions that start in 3 hours
      const { data: upcomingSessions, error } = await supabase
        .from("sessions")
        .select(`
          *,
          teacher:profiles!sessions_teacher_id_fkey(id, first_name, last_name, email)
        `)
        .eq("status", "scheduled")
        .gte("start_time", now.toISOString())
        .lte("start_time", threeHoursLater.toISOString());
      
      if (error) {
        console.error("Error checking upcoming sessions:", error);
        return;
      }
      
      // For each upcoming session, send a reminder
      if (upcomingSessions && upcomingSessions.length > 0) {
        for (const session of upcomingSessions) {
          // Get the session attendees (students)
          const { data: attendees, error: attendeesError } = await supabase
            .from("session_attendees")
            .select(`
              student:profiles!session_attendees_student_id_fkey(id, first_name, last_name, email)
            `)
            .eq("session_id", session.id);
            
          if (attendeesError) {
            console.error(`Error fetching attendees for session ${session.id}:`, attendeesError);
            continue;
          }
          
          if (attendees && attendees.length > 0) {
            for (const attendee of attendees) {
              // Type guard to ensure we have valid teacher and student data
              if (!attendee.student || !session.teacher) {
                console.log("Missing student or teacher data for reminder");
                continue;
              }
              
              // Send reminder with 3-hour notice
              await sendSessionNotification(
                session.teacher,
                attendee.student,
                session,
                "This is a reminder that your session starts in 3 hours. Please make sure you're prepared and ready to join."
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in checkUpcomingSessionReminders:", error);
    }
  };

  return { checkUpcomingSessionReminders };
};
