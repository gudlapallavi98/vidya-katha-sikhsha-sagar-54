
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export interface SessionRequestStudent {
  first_name: string;
  last_name: string;
  email: string;
}

export interface SessionRequest {
  id: string;
  proposed_title: string;
  proposed_date: string;
  proposed_duration: number;
  request_message: string | null;
  status: string;
  created_at: string;
  student: SessionRequestStudent;
  course: {
    title: string;
  } | null;
}

export const useSessionRequests = () => {
  const { user } = useAuth();
  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchSessionRequests = async () => {
      try {
        // Get basic session request data
        const { data, error } = await supabase
          .from('session_requests')
          .select(`
            id,
            proposed_title,
            proposed_date,
            proposed_duration,
            request_message,
            status,
            created_at,
            student_id,
            course:course_id (
              title
            )
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data) {
          // For each request, fetch the associated student profile separately
          const requestsWithStudents = await Promise.all(
            data.map(async (request) => {
              try {
                const { data: studentData, error: studentError } = await supabase
                  .from('profiles')
                  .select('first_name, last_name, email')
                  .eq('id', request.student_id)
                  .single();
              
                if (studentError) {
                  console.error("Error fetching student data:", studentError);
                  return null;
                }
              
                if (!studentData) {
                  console.error("No student data found for id:", request.student_id);
                  return null;
                }
                
                return {
                  ...request,
                  student: {
                    first_name: studentData.first_name,
                    last_name: studentData.last_name,
                    email: studentData.email
                  }
                };
              } catch (err) {
                console.error("Error processing student data:", err);
                return null;
              }
            })
          );
          
          // Filter out any failed requests
          const validRequests = requestsWithStudents.filter(
            (request): request is SessionRequest => request !== null
          );
          
          setSessionRequests(validRequests);
        }
      } catch (error) {
        console.error("Error fetching session requests:", error);
        toast({
          variant: "destructive",
          title: "Failed to load session requests",
          description: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSessionRequests();
  }, [user, toast]);

  return { sessionRequests, loading };
};

export const useSessionStatusChange = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
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
            .select('first_name, last_name, email')
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
            .select('first_name, last_name, email')
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
          
          // Send email notifications
          try {
            await fetch("https://nxdsszdobgbikrnqqrue.supabase.co/functions/v1/send-email/schedule-notification", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                teacherEmail: teacherData.email,
                teacherName: `${teacherData.first_name} ${teacherData.last_name}`,
                studentEmail: studentData.email,
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
        } catch (error) {
          console.error("Error processing session acceptance:", error);
          // Continue with status update even if there's an error with additional processing
        }
      }

      toast({
        title: `Session ${newStatus}`,
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
