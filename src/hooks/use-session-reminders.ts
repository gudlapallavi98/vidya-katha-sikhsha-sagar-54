
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, addHours } from "date-fns";
import { sendSessionNotification } from "@/utils/email-notification";

// Type definitions to help with type safety
interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Teacher {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

interface Student {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
}

interface Session {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  meeting_link?: string | null;
  teacher?: Teacher | null;
}

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
              // Ensure both teacher and student objects exist and aren't error objects
              if (!session.teacher || !attendee.student || 
                  typeof session.teacher !== 'object' || typeof attendee.student !== 'object') {
                console.log("Missing student or teacher data for reminder");
                continue;
              }
              
              // Create safe objects with default values for required properties
              const teacherData = {
                first_name: session.teacher && typeof session.teacher === 'object' && 'first_name' in session.teacher ? (session.teacher.first_name as string | null || '') : '',
                last_name: session.teacher && typeof session.teacher === 'object' && 'last_name' in session.teacher ? (session.teacher.last_name as string | null || '') : '',
                email: session.teacher && typeof session.teacher === 'object' && 'email' in session.teacher ? (session.teacher.email as string | null || '') : ''
              };
              
              const studentData = {
                first_name: attendee.student && typeof attendee.student === 'object' && 'first_name' in attendee.student ? (attendee.student.first_name as string | null || '') : '',
                last_name: attendee.student && typeof attendee.student === 'object' && 'last_name' in attendee.student ? (attendee.student.last_name as string | null || '') : '',
                email: attendee.student && typeof attendee.student === 'object' && 'email' in attendee.student ? (attendee.student.email as string | null || '') : ''
              };
              
              // Only send notification if we have email addresses
              if (!teacherData.email || !studentData.email) {
                console.log("Missing email addresses for notification");
                continue;
              }
              
              // Send reminder with 3-hour notice
              await sendSessionNotification(
                teacherData,
                studentData,
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
