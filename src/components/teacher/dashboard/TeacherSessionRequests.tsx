
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

interface SessionRequest {
  id: string;
  proposed_title: string;
  proposed_date: string;
  proposed_duration: number;
  request_message: string | null;
  status: string;
  created_at: string;
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
  course: {
    title: string;
  } | null;
}

const TeacherSessionRequests = () => {
  const { user } = useAuth();
  const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchSessionRequests = async () => {
      try {
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
            student:student_id (
              first_name,
              last_name,
              email
            ),
            course:course_id (
              title
            )
          `)
          .eq('teacher_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Ensure the data is properly typed before setting state
        if (data) {
          const typedData = data as unknown as SessionRequest[];
          setSessionRequests(typedData);
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
        // Fetch teacher and student information separately to avoid join issues
        const { data: teacherData } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', requestData.teacher_id)
          .single();
          
        const { data: studentData } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', requestData.student_id)
          .single();
        
        if (!teacherData || !studentData) {
          console.error("Could not fetch teacher or student data");
          throw new Error("Could not fetch required user data");
        }
        
        // Generate a meeting link (in a real app, this would create a real meeting link)
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
      }

      toast({
        title: `Session ${newStatus}`,
        description: `The session request has been ${newStatus}.`,
      });

      // Update the local state
      setSessionRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
    } catch (error) {
      console.error("Error updating session request:", error);
      toast({
        variant: "destructive",
        title: "Failed to update session request",
        description: "Please try again",
      });
    }
  };

  const renderSessionRequests = (status: string) => {
    const filteredRequests = sessionRequests.filter(req => req.status === status);
    
    if (filteredRequests.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No {status} session requests</p>;
    }
    
    return filteredRequests.map((request) => (
      <Card key={request.id} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{request.proposed_title}</CardTitle>
          <CardDescription>
            {request.student.first_name} {request.student.last_name}
            {request.course?.title && ` • ${request.course.title} course`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date & Time:</span>
              <span>{format(new Date(request.proposed_date), 'MMM d, yyyy • h:mm a')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span>{request.proposed_duration} minutes</span>
            </div>
            {request.request_message && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-1">Message:</p>
                <p className="text-sm bg-muted p-2 rounded">{request.request_message}</p>
              </div>
            )}
            
            {status === 'pending' && (
              <div className="flex gap-2 mt-4">
                <Button 
                  className="flex-1 bg-indian-green hover:bg-indian-green/90 text-white"
                  onClick={() => handleStatusChange(request.id, 'accepted')}
                >
                  Accept
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => handleStatusChange(request.id, 'rejected')}
                >
                  Decline
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    ));
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="h-[200px] flex items-center justify-center">
          <p>Loading session requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Session Requests</h2>
        <p className="text-muted-foreground">Manage your incoming session requests from students</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {renderSessionRequests('pending')}
        </TabsContent>
        
        <TabsContent value="accepted" className="space-y-4">
          {renderSessionRequests('accepted')}
        </TabsContent>
        
        <TabsContent value="rejected" className="space-y-4">
          {renderSessionRequests('rejected')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherSessionRequests;
