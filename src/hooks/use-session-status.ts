import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, addHours } from "date-fns";

export const useSessionStatus = () => {
  const { toast } = useToast();
  
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
              if (!attendee.student?.email || !session.teacher?.email) {
                console.log("Missing email for student or teacher");
                continue;
              }
              
              // Send reminder notification
              try {
                const startTime = parseISO(session.start_time);
                const endTime = parseISO(session.end_time);
                
                const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/schedule-notification`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    teacherEmail: session.teacher.email,
                    teacherName: `${session.teacher.first_name} ${session.teacher.last_name}`,
                    studentEmail: attendee.student.email,
                    studentName: `${attendee.student.first_name} ${attendee.student.last_name}`,
                    sessionTitle: session.title,
                    sessionDate: format(startTime, "MMMM dd, yyyy"),
                    sessionTime: `${format(startTime, "h:mm a")} - ${format(endTime, "h:mm a")}`,
                    sessionLink: session.meeting_link || "Link will be available soon",
                    additionalInfo: "This is a reminder that your session starts in 3 hours. Please make sure you're prepared and ready to join."
                  }),
                });
                
                if (!response.ok) {
                  throw new Error(`Failed to send reminder: ${response.status}`);
                }
                
                const result = await response.json();
                console.log("Reminder sent:", result);
                
              } catch (notificationError) {
                console.error("Error sending session reminder:", notificationError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in checkUpcomingSessionReminders:", error);
    }
  };

  // Function to be called when a session is accepted
  const handleSessionAccepted = async (sessionId, teacherData, studentData, sessionData) => {
    try {
      // Send notification to both teacher and student
      const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/schedule-notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherEmail: teacherData.email,
          teacherName: `${teacherData.first_name} ${teacherData.last_name}`,
          studentEmail: studentData.email,
          studentName: `${studentData.first_name} ${studentData.last_name}`,
          sessionTitle: sessionData.title,
          sessionDate: format(parseISO(sessionData.start_time), "MMMM dd, yyyy"),
          sessionTime: `${format(parseISO(sessionData.start_time), "h:mm a")} - ${format(parseISO(sessionData.end_time), "h:mm a")}`,
          sessionLink: sessionData.meeting_link || "Link will be available soon",
          additionalInfo: "Your session has been scheduled. We look forward to seeing you then!"
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Session acceptance notification sent:", result);
      
      toast({
        title: "Session Notifications Sent",
        description: "Both teacher and student have been notified about the scheduled session."
      });
      
    } catch (error) {
      console.error("Error sending session acceptance notification:", error);
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: "Failed to send session notifications."
      });
    }
  };

  return {
    cancelExpiredAvailabilities,
    checkUpcomingSessionReminders,
    handleSessionAccepted
  };
};
