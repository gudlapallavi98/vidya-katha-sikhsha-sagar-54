
import { useState } from "react";
import { useStudentCourses, useStudentSessions } from "@/hooks/use-dashboard-data";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStatus } from "@/hooks/use-auth-status";

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
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { isAuthenticated, isChecking } = useAuthStatus();

  const { data: studentCourses = [], isLoading: coursesLoading } = useStudentCourses();
  const { data: studentSessions = [], isLoading: sessionsLoading } = useStudentSessions();

  // Calculate upcoming sessions
  const upcomingSessions = studentSessions.filter(session => 
    session.status === 'scheduled' || session.status === 'in_progress'
  );

  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useAuthStatus
  }

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
          studentCourses={studentCourses}
          coursesLoading={coursesLoading}
          upcomingSessions={upcomingSessions}
          sessionsLoading={sessionsLoading}
          selectedTeacherId={selectedTeacherId}
          setSelectedTeacherId={setSelectedTeacherId}
          selectedCourseId={selectedCourseId}
          setSelectedCourseId={setSelectedCourseId}
        />
      }
    />
  );
};

export default StudentDashboardWithQueryClient;
