import { useState, useEffect } from "react";
import { 
  useTeacherCourses, 
  useSessionRequests, 
  useTeacherSessions
} from "@/hooks/use-dashboard-data";
import { useToast } from "@/hooks/use-toast";
import { acceptSessionRequest, rejectSessionRequest, startSession } from "@/api/dashboard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { useNavigate } from "react-router-dom";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { useSessionStatusUpdater } from "@/hooks/use-session-status-updater";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TeacherDashboardSidebar from "@/components/teacher/dashboard/TeacherDashboardSidebar";
import TeacherDashboardContent from "@/components/teacher/dashboard/TeacherDashboardContent";

const TeacherDashboard = () => {
  const { activeTab, handleTabChange } = useTabNavigation("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, isChecking } = useAuthStatus();
  const queryClient = useQueryClient();
  
  // Use the session status updater hook
  useSessionStatusUpdater();
  
  const { data: teacherCourses = [], isLoading: coursesLoading } = useTeacherCourses();
  const { data: sessionRequests = [], isLoading: requestsLoading } = useSessionRequests(searchQuery);
  const { data: teacherSessions = [], isLoading: sessionsLoading } = useTeacherSessions();
  
  // Calculate metrics from sessions data with proper filtering
  const now = new Date();
  const upcomingSessions = teacherSessions.filter(s => {
    const sessionEndTime = new Date(s.end_time);
    // Only include sessions that haven't ended yet
    const isUpcoming = sessionEndTime >= now;
    
    console.log("Filtering teacher session:", {
      sessionId: s.id,
      title: s.title,
      endTime: sessionEndTime.toISOString(),
      now: now.toISOString(),
      isUpcoming,
      status: s.status
    });
    
    return isUpcoming && (s.status === 'scheduled' || s.status === 'in_progress');
  });
  
  console.log("Total teacher sessions:", teacherSessions.length);
  console.log("Filtered upcoming sessions:", upcomingSessions.length);
  
  const totalSessions = {
    completed: teacherSessions.filter(s => s.status === 'completed').length,
    upcoming: upcomingSessions.length
  };

  const handleAcceptSession = async (sessionId: string) => {
    try {
      await acceptSessionRequest(sessionId);
      toast({
        title: "Session Accepted",
        description: "The session has been scheduled.",
      });
      
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

  if (isChecking) {
    return <div className="flex items-center justify-center h-screen bg-[#fdf6ee]">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useAuthStatus
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee]">
      <DashboardLayout
        sidebar={
          <TeacherDashboardSidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
          />
        }
        children={
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
        }
      />
    </div>
  );
};

export default TeacherDashboard;
