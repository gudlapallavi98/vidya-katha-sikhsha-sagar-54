
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { joinSession } from "@/api/dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { 
  useStudentEnrollments, 
  useStudentUpcomingSessions, 
  useStudentProgress, 
  useStudentAchievements 
} from "@/hooks/use-dashboard-data";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentDashboardSidebar from "@/components/student/dashboard/StudentDashboardSidebar";
import StudentDashboardContent from "@/components/student/dashboard/StudentDashboardContent";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      retry: 1, // Limit retries to avoid excessive API calls
    },
  },
});

// Wrapper component to provide React Query context
const StudentDashboardWithQueryClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentDashboard />
    </QueryClientProvider>
  );
};

const StudentDashboard = () => {
  const { activeTab, handleTabChange } = useTabNavigation("overview");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: enrolledCourses = [], isLoading: coursesLoading } = useStudentEnrollments();
  const { data: progress = [], isLoading: progressLoading } = useStudentProgress();
  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useStudentUpcomingSessions();
  const { data: achievements = [], isLoading: achievementsLoading } = useStudentAchievements();

  const handleJoinClass = async (sessionId: string) => {
    try {
      if (!user) return;
      
      const meetingLink = await joinSession(sessionId, user.id);
      
      if (meetingLink) {
        window.open(meetingLink, '_blank');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Meeting link not available yet. Try again in a few minutes.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error joining class",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <DashboardLayout
      sidebar={
        <StudentDashboardSidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
        />
      }
      children={
        <StudentDashboardContent 
          activeTab={activeTab}
          enrolledCourses={enrolledCourses}
          coursesLoading={coursesLoading}
          upcomingSessions={upcomingSessions}
          sessionsLoading={sessionsLoading}
          progress={progress}
          handleJoinClass={handleJoinClass}
        />
      }
    />
  );
};

export default StudentDashboardWithQueryClient;
