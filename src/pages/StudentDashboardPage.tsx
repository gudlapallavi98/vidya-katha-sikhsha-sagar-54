
import { useState } from "react";
import { useStudentCourses, useStudentSessions } from "@/hooks/use-dashboard-data";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { AnimatedBackground } from "@/components/ui/animated-background";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentDashboardSidebar from "@/components/student/dashboard/StudentDashboardSidebar";
import StudentDashboardContent from "@/components/student/dashboard/StudentDashboardContent";

// Create a client
const queryClient = new QueryClient();

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
  const { isAuthenticated, isChecking } = useAuthStatus();

  const { data: enrolledCourses = [], isLoading: coursesLoading } = useStudentCourses();
  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useStudentSessions();

  // Calculate upcoming sessions
  const filteredSessions = upcomingSessions.filter(session => 
    session.status === 'scheduled' || session.status === 'in_progress'
  );

  const handleJoinClass = async (sessionId: string) => {
    try {
      console.log("Joining session:", sessionId);
      // Implementation for joining class
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };

  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useAuthStatus
  }

  return (
    <AnimatedBackground variant="student">
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
            upcomingSessions={filteredSessions}
            sessionsLoading={sessionsLoading}
            progress={[]}
            handleJoinClass={handleJoinClass}
          />
        }
      />
    </AnimatedBackground>
  );
};

export default StudentDashboardWithQueryClient;
