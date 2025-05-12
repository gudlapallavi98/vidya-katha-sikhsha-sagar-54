
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSessionAcceptance } from "./use-session-acceptance";

export const useSessionStatusChange = () => {
  const { toast } = useToast();
  const { handleSessionAccepted } = useSessionAcceptance();

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
          
        if (teacherError || !teacherData) {
          console.error("Error fetching teacher data:", teacherError);
          toast({
            title: "Session Accepted",
            description: "The session has been scheduled, but notification emails could not be sent."
          });
          return true;
        }
        
        // Create a session attendee record for the student
        const { error: attendeeCreateError } = await supabase
          .from('session_attendees')
          .insert({
            session_id: session.id,
            student_id: request.student_id
          });
          
        if (attendeeCreateError) {
          console.error("Error creating session attendee:", attendeeCreateError);
          toast({
            title: "Session Accepted",
            description: "The session has been scheduled, but student was not added as an attendee."
          });
          return true;
        }
        
        // Get student profile data directly
        const { data: studentData, error: studentError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', request.student_id)
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

  return { handleStatusChange };
};
