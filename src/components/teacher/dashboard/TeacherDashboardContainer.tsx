import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 
import { useSessionAcceptance } from "@/hooks/use-session-acceptance";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import { 
  useTeacherCourses, 
  useTeacherProfile 
} from "@/hooks/teacher/use-teacher-data";
import {
  useSessionRequests,
  useTeacherSessions
} from "@/hooks/teacher/use-teacher-sessions";
import { acceptSessionRequest, rejectSessionRequest, startSession } from "@/api/dashboard";
import TeacherDashboardContent from "./TeacherDashboardContent";
import HorizontalNavigation from "@/components/dashboard/HorizontalNavigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar,
  Users,
  Settings 
} from "lucide-react";

/**
 * Main container component for the teacher dashboard
 * Handles data fetching and business logic
 */
const TeacherDashboardContainer = () => {
  // Ensure all hooks are called in the same order on every render
  const { user } = useAuth();
  const { toast } = useToast();
  const { activeTab, handleTabChange } = useDashboardTabs("overview");
  const { handleSessionAccepted } = useSessionAcceptance();
  
  // State hooks
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data fetching hooks
  const { data: teacherCourses = [], isLoading: coursesLoading } = useTeacherCourses();
  const { data: sessionRequests = [], isLoading: requestsLoading } = useSessionRequests(searchQuery);
  const { data: teacherSessions = [], isLoading: sessionsLoading } = useTeacherSessions();
  
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

  // Handler functions
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

  // Navigation items
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "sessions", label: "Session Requests", icon: Users },
    { id: "schedule", label: "My Schedule", icon: Calendar },
    { id: "availability", label: "Set Availability", icon: Calendar },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];

  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold font-sanskrit mb-6">Teacher Dashboard</h1>
      
      <HorizontalNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        items={navItems}
        variant="teacher"
      />
      
      <TeacherDashboardContent
        activeTab={activeTab}
        handleTabChange={handleTabChange}
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
  );
};

export default TeacherDashboardContainer;
