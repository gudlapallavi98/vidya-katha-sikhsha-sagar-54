
import { format, parseISO } from "date-fns";

interface EmailParticipant {
  first_name?: string;
  last_name?: string;
  email?: string;
}

interface SessionData {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  meeting_link?: string | null;
}

/**
 * Sends a session notification email to participants
 */
export const sendSessionNotification = async (
  teacherData: EmailParticipant,
  studentData: EmailParticipant,
  sessionData: SessionData,
  additionalInfo: string
): Promise<boolean> => {
  try {
    // Validate required data
    if (!teacherData?.email || !studentData?.email) {
      console.error("Missing email for teacher or student");
      return false;
    }
    
    const response = await fetch(`https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/schedule-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherEmail: teacherData.email,
        teacherName: `${teacherData.first_name || 'Teacher'} ${teacherData.last_name || ''}`,
        studentEmail: studentData.email,
        studentName: `${studentData.first_name || 'Student'} ${studentData.last_name || ''}`,
        sessionTitle: sessionData.title,
        sessionDate: format(parseISO(sessionData.start_time), "MMMM dd, yyyy"),
        sessionTime: `${format(parseISO(sessionData.start_time), "h:mm a")} - ${format(parseISO(sessionData.end_time), "h:mm a")}`,
        sessionLink: sessionData.meeting_link || "Link will be available soon",
        additionalInfo
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send notification: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Email notification sent:", result);
    return true;
    
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
};
