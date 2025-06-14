
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const useSessionStatusChange = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      // If rejecting a session request, initiate refund process
      if (newStatus === 'rejected') {
        // Get the session request to find the payment details
        const { data: sessionRequest, error: fetchError } = await supabase
          .from('session_requests')
          .select(`
            id,
            payment_status,
            payment_history(transaction_id, payment_status, id)
          `)
          .eq('id', requestId)
          .single();

        if (fetchError) {
          console.error("Error fetching session request:", fetchError);
        } else if (sessionRequest?.payment_status === 'completed') {
          // Initiate refund process
          try {
            const { error: refundError } = await supabase.functions.invoke('cashfree-payment', {
              body: {
                action: 'process_refund',
                session_request_id: requestId,
                order_id: sessionRequest.payment_history?.[0]?.transaction_id
              }
            });

            if (!refundError) {
              // Update payment history with enhanced notes
              const { error: updateNotesError } = await supabase
                .from('payment_history')
                .update({
                  notes: 'Refund initiated - Teacher rejected the session request. The student will receive their full refund within 3-5 business days. No charges will apply.',
                  updated_at: new Date().toISOString()
                })
                .eq('id', sessionRequest.payment_history?.[0]?.id);

              if (updateNotesError) {
                console.error('Error updating payment notes:', updateNotesError);
              }

              toast({
                title: "Refund Initiated",
                description: "The student will receive their refund within 3-5 business days.",
              });
            }
          } catch (refundError) {
            console.error("Error processing refund:", refundError);
          }
        }
      }

      // Update the request status
      const { error } = await supabase
        .from('session_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;
      
      // Get the request details for the email notification
      const { data: requestData, error: fetchError } = await supabase
        .from('session_requests')
        .select(`
          id, 
          proposed_title, 
          proposed_date,
          teacher_id,
          student_id
        `)
        .eq('id', requestId)
        .single();
        
      if (fetchError) throw fetchError;
      
      if (requestData && newStatus === 'accepted') {
        try {
          // Fetch teacher profile information
          const { data: teacherData, error: teacherError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', requestData.teacher_id)
            .single();
            
          if (teacherError) {
            console.error("Error fetching teacher data:", teacherError);
            throw teacherError;
          }
          
          if (!teacherData) {
            throw new Error("Teacher data not found");
          }
          
          // Fetch student profile information
          const { data: studentData, error: studentError } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', requestData.student_id)
            .single();
          
          if (studentError) {
            console.error("Error fetching student data:", studentError);
            throw studentError;
          }
          
          if (!studentData) {
            throw new Error("Student data not found");
          }
          
          // Generate a meeting link
          const meetingLink = `https://etutorss.com/meeting/${requestId}`;
          
          // Create a session record
          const { data: session, error: sessionError } = await supabase
            .from('sessions')
            .insert([
              {
                title: requestData.proposed_title,
                start_time: new Date(requestData.proposed_date).toISOString(),
                end_time: new Date(new Date(requestData.proposed_date).getTime() + 60*60*1000).toISOString(), // 1 hour session by default
                teacher_id: user?.id,
                student_id: requestData.student_id,
                status: 'scheduled',
                meeting_link: meetingLink
              }
            ])
            .select();
            
          if (sessionError) throw sessionError;
          
          // Get emails for both users
          try {
            const { data: teacherProfile, error: teacherProfileError } = await supabase
              .auth.admin.getUserById(requestData.teacher_id);
            
            const { data: studentProfile, error: studentProfileError } = await supabase
              .auth.admin.getUserById(requestData.student_id);
              
            if (teacherProfileError || studentProfileError || !teacherProfile || !studentProfile) {
              console.error("Error getting user profiles");
              // Continue without throwing - email notifications are secondary
            } else {
              const teacherEmail = teacherProfile.user.email;
              const studentEmail = studentProfile.user.email;
              
              // Send email notifications
              if (teacherEmail && studentEmail) {
                try {
                  await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/schedule-notification", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      teacherEmail: teacherEmail,
                      teacherName: `${teacherData.first_name} ${teacherData.last_name}`,
                      studentEmail: studentEmail,
                      studentName: `${studentData.first_name} ${studentData.last_name}`,
                      sessionTitle: requestData.proposed_title,
                      sessionDate: format(new Date(requestData.proposed_date), 'MMMM d, yyyy'),
                      sessionTime: format(new Date(requestData.proposed_date), 'h:mm a'),
                      sessionLink: meetingLink,
                      additionalInfo: "Please join the session 5 minutes before the scheduled time."
                    })
                  });
                } catch (emailError) {
                  console.error("Failed to send session notification emails:", emailError);
                  // Don't throw error here, we still want to show success even if email fails
                }
              }
            }
          } catch (authError) {
            console.error("Error fetching user emails:", authError);
            // Continue without throwing - email notifications are secondary
          }
        } catch (error) {
          console.error("Error processing session acceptance:", error);
          // Continue with status update even if there's an error with additional processing
        }
      }

      const statusMessage = newStatus === 'rejected' 
        ? 'Session rejected. Refund has been initiated.'
        : `Session ${newStatus}`;

      toast({
        title: statusMessage,
        description: `The session request has been ${newStatus}.`,
      });
      
      return true;

    } catch (error) {
      console.error("Error updating session request:", error);
      toast({
        variant: "destructive",
        title: "Failed to update session request",
        description: "Please try again",
      });
      return false;
    }
  };

  return { handleStatusChange };
};
