
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  useTeacherCourses, 
  useSessionRequests, 
  useTeacherSessions
} from "@/hooks/use-dashboard-data";
import { useToast } from "@/hooks/use-toast";
import { acceptSessionRequest, rejectSessionRequest, startSession } from "@/api/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TeacherSidebar from "@/components/teacher/dashboard/TeacherSidebar";
import TeacherDashboardContent from "@/components/teacher/dashboard/TeacherDashboardContent";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 
import { useSessionAcceptance } from "@/hooks/use-session-acceptance";

// Create a client
const queryClient = new QueryClient();

// Wrapper component to provide React Query context
const TeacherDashboardWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TeacherDashboard />
    </QueryClientProvider>
  );
};

const TeacherDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const { handleSessionAccepted } = useSessionAcceptance();
  
  const { data: teacherCourses = [], isLoading: coursesLoading } = useTeacherCourses();
  const { data: sessionRequests = [], isLoading: requestsLoading } = useSessionRequests(searchQuery);
  const { data: teacherSessions = [], isLoading: sessionsLoading } = useTeacherSessions();
  
  // Handle URL parameter once on mount and only when it changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Update URL when tab changes with replace: true to avoid page reload
  const handleTabChange = useCallback((tab: string) => {
    if (activeTab === tab) return; // Prevent unnecessary updates
    
    setActiveTab(tab);
    // Use replace: true to avoid adding to browser history and prevent reloads
    setSearchParams({ tab }, { replace: true });
  }, [activeTab, setSearchParams]);
  
  // Calculate metrics from sessions data
  const upcomingSessions = teacherSessions.filter(s => {
    const sessionEndTime = new Date(s.end_time);
    const now = new Date();
    // Include sessions that haven't ended yet
    return s.status === 'scheduled' || s.status === 'in_progress' || sessionEndTime >= now;
  });
  
  const totalSessions = {
    completed: teacherSessions.filter(s => s.status === 'completed').length,
    upcoming: upcomingSessions.length
  };

  const handleAcceptSession = async (sessionId: string) => {
    try {
      const result = await acceptSessionRequest(sessionId);
      toast({
        title: "Session Accepted",
        description: "The session has been scheduled.",
      });
      
      // Get teacher and student data for notification
      if (result) {
        // Get teacher data
        const { data: teacherData, error: teacherError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', result.teacher_id)
          .single();
          
        if (teacherError || !teacherData) {
          console.error("Error fetching teacher data:", teacherError);
          return;
        }
        
        // Get attendee data to find student_id
        const { data: attendeeData, error: attendeeError } = await supabase
          .from('session_attendees')
          .select('student_id')
          .eq('session_id', result.id)
          .single();
          
        if (attendeeError || !attendeeData) {
          console.error("Error fetching attendee data:", attendeeError);
          return;
        }
        
        // Now get the student profile using student_id from attendees
        const { data: studentData, error: studentError } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('id', attendeeData.student_id)
          .single();
          
        if (studentError || !studentData) {
          console.error("Error fetching student data:", studentError);
          return;
        }
          
        if (teacherData && studentData) {
          // Send notifications
          await handleSessionAccepted(
            sessionId,
            teacherData,
            studentData,
            result
          );
        }
      }
      
      // Invalidate the queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['session_requests'] });
      queryClient.invalidateQueries({ queryKey: ['teacher_sessions'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error accepting session",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleRejectSession = async (sessionId: string) => {
    try {
      await rejectSessionRequest(sessionId);
      toast({
        title: "Session Rejected",
        description: "The session request has been declined.",
      });
      
      // Invalidate the query to refresh data
      queryClient.invalidateQueries({ queryKey: ['session_requests'] });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error rejecting session",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleStartClass = async (sessionId: string) => {
    try {
      const meetingLink = await startSession(sessionId);
      
      // Open the meeting link in a new tab
      if (meetingLink) {
        window.open(meetingLink, '_blank');
        
        // Invalidate the query to refresh data
        queryClient.invalidateQueries({ queryKey: ['teacher_sessions'] });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error starting class",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <TeacherSidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Main content */}
        <TeacherDashboardContent
          activeTab={activeTab}
          teacherCourses={teacherCourses}
          coursesLoading={coursesLoading}
          sessionRequests={sessionRequests}
          requestsLoading={requestsLoading}
          teacherSessions={teacherSessions}
          upcomingSessions={upcomingSessions}
          sessionsLoading={sessionsLoading}
          totalSessions={totalSessions}
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          handleAcceptSession={handleAcceptSession}
          handleRejectSession={handleRejectSession}
          handleStartClass={handleStartClass}
        />
      </div>
    </div>
  );
};

export default TeacherDashboardWithQueryClient;
