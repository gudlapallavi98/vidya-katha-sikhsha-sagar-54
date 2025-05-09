
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SessionRequest, SessionRequestStudent } from "@/hooks/types";

export const useFetchSessionRequests = () => {
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
                if (!request.student_id) {
                  console.error("Missing student_id in request:", request);
                  return null;
                }

                // Get student profile data
                const { data: studentData, error: studentError } = await supabase
                  .from('profiles')
                  .select('first_name, last_name')
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
                
                // Create a complete request object with student data
                const student: SessionRequestStudent = {
                  first_name: studentData.first_name,
                  last_name: studentData.last_name,
                  email: '' // Setting empty string since email might not exist in profile
                };

                return {
                  ...request,
                  student
                };
              } catch (err) {
                console.error("Error processing student data:", err);
                return null;
              }
            })
          );
          
          // Filter out any failed requests
          const validRequests = requestsWithStudents.filter(
            (request): request is SessionRequest => 
              request !== null && 
              request.student !== undefined
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
