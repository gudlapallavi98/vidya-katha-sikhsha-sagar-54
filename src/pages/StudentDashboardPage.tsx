
import { useState } from "react";
import { useStudentCourses, useStudentSessions } from "@/hooks/use-dashboard-data";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { useAuthStatus } from "@/hooks/use-auth-status";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StudentDashboardSidebar from "@/components/student/dashboard/StudentDashboardSidebar";
import StudentDashboardContent from "@/components/student/dashboard/StudentDashboardContent";

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
    return (
      <div className="flex items-center justify-center h-screen bg-[#fdf6ee]">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#FF9933] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useAuthStatus
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee]">
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
    </div>
  );
};

export default StudentDashboard;
