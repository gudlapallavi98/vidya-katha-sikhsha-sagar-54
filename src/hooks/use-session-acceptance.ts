
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendSessionNotification } from "@/utils/email-notification";

export const useSessionAcceptance = () => {
  const { toast } = useToast();

  // Function to be called when a session is accepted
  const handleSessionAccepted = async (sessionId, teacherData, studentData, sessionData) => {
    try {
      // Ensure data is valid before proceeding
      if (!teacherData || !studentData || !sessionData) {
        console.error("Missing data for session notification");
        return false;
      }

      // Send notification to both teacher and student
      const success = await sendSessionNotification(
        teacherData,
        studentData,
        sessionData,
        "Your session has been scheduled. We look forward to seeing you then!"
      );
      
      if (success) {
        toast({
          title: "Session Notifications Sent",
          description: "Both teacher and student have been notified about the scheduled session."
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Notification Error",
          description: "Failed to send session notifications."
        });
        return false;
      }
    } catch (error) {
      console.error("Error sending session acceptance notification:", error);
      toast({
        variant: "destructive",
        title: "Notification Error",
        description: "Failed to send session notifications."
      });
      return false;
    }
  };
  
  return { handleSessionAccepted };
};
