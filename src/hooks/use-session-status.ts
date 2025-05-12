
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
      // Ensure data is valid before proceeding
      if (!teacherData || !studentData || !sessionData) {
        console.error("Missing data for session notification");
        return;
      }
      
      // Verify required properties exist
      if (!teacherData.email || !studentData.email) {
        console.error("Missing email for teacher or student");
        return;
      }

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
  
  // Add a new function for session status changes
  const handleStatusChange = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      if (status === 'accepted') {
        // Get request details
        const { data: request, error: requestError } = await supabase
          .from('session_requests')
          .select('*')
          .eq('id', requestId)
          .single();
          
        if (requestError || !request) {
          throw new Error('Session request not found');
        }
        
        // Create a session
        const { data: session, error: sessionError } = await supabase
          .from('sessions')
          .insert({
            course_id: request.course_id,
            teacher_id: request.teacher_id,
            title: request.proposed_title,
            description: request.request_message,
            start_time: request.proposed_date,
            end_time: new Date(new Date(request.proposed_date).getTime() + request.proposed_duration * 60000).toISOString(),
            status: 'scheduled',
            meeting_link: `https://meet.jit.si/${requestId}-${new Date().getTime()}`
          })
          .select()
          .single();
          
        if (sessionError || !session) {
          throw sessionError || new Error('Failed to create session');
        }
        
        // Update request status
        const { error: updateError } = await supabase
          .from('session_requests')
          .update({ status: 'accepted' })
          .eq('id', requestId);
          
        if (updateError) {
          throw updateError;
        }
        
        // Get teacher profile data
        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', session.teacher_id)
          .single();
          
        if (teacherError) {
          console.error("Error fetching teacher data:", teacherError);
          toast({
            title: "Session Accepted",
            description: "The session has been scheduled, but notification emails could not be sent."
          });
          return true;
        }
        
        // Get student id from attendees
        const { data: attendeeData, error: attendeeError } = await supabase
          .from('session_attendees')
          .select('student_id')
          .eq('session_id', session.id)
          .single();
          
        if (attendeeError || !attendeeData) {
          console.error("Error fetching attendee data:", attendeeError);
          toast({
            title: "Session Accepted",
            description: "The session has been scheduled, but notification emails could not be sent."
          });
          return true;
        }
        
        // Get student profile
        const { data: studentData, error: studentError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', attendeeData.student_id)
          .single();
          
        if (studentError || !studentData) {
          console.error("Error fetching student data:", studentError);
          toast({
            title: "Session Accepted",
            description: "The session has been scheduled, but notification emails could not be sent."
          });
          return true;
        }
        
        // If both teacher and student data are available, send notifications
        if (teacherData && studentData) {
          await handleSessionAccepted(
            session.id,
            teacherData,
            studentData,
            session
          );
        }
        
        toast({
          title: "Session Accepted",
          description: "The session has been scheduled successfully."
        });
        
        return true;
      } else if (status === 'rejected') {
        const { error } = await supabase
          .from('session_requests')
          .update({ status: 'rejected' })
          .eq('id', requestId);
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Session Rejected",
          description: "The session request has been rejected."
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error changing session status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update session status"
      });
      return false;
    }
  };

  return {
    cancelExpiredAvailabilities,
    checkUpcomingSessionReminders,
    handleSessionAccepted,
    handleStatusChange
  };
};

// Export a named hook that matches what's being imported in TeacherSessionRequests.tsx
export const useSessionStatusChange = () => {
  return useSessionStatus();
};
