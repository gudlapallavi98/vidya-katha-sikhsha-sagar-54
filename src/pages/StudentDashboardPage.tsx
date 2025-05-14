
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  Clock,
  Users,
  Settings
} from "lucide-react";
import StudentDashboardContent from "@/components/student/dashboard/StudentDashboardContent";
import HorizontalNavigation from "@/components/dashboard/HorizontalNavigation";

// Create a persistent QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
});

// Wrapper component to provide React Query context
const StudentDashboardPage = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StudentDashboard />
    </QueryClientProvider>
  );
};

const StudentDashboard = () => {
  // Use our improved dashboard tabs hook
  const { activeTab, handleTabChange } = useDashboardTabs("overview");
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get all dashboard data using our custom hook
  const dashboard = useStudentDashboard();
  
  // Handle joining a class
  const handleJoinClass = async (sessionId: string) => {
    try {
      if (!user) return;
      
      // Just a placeholder for the join class action
      toast({
        title: "Session Joined",
        description: "You've successfully joined the class.",
      });
      
      // Here we would normally redirect to a class room
      window.open(`https://meet.google.com/demo-class-${sessionId.substring(0, 6)}`, '_blank');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to join class",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  // Filter upcoming sessions (in the next 30 days)
  const upcomingSessionsList = dashboard.upcomingSessions.data?.filter(session => {
    const sessionDate = new Date(session.start_time);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return sessionDate <= thirtyDaysFromNow && sessionDate >= today;
  }) || [];

  // Filter completed sessions
  const completedSessionsList = dashboard.pastSessions.data?.filter(session => {
    return session.status === 'completed';
  }) || [];

  // Prepare loading states for child components
  const loadingStates = {
    enrollments: dashboard.enrollments.isLoading,
    upcomingSessions: dashboard.upcomingSessions.isLoading,
    pastSessions: dashboard.pastSessions.isLoading
  };

  // Navigation items
  const navItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "sessions", label: "Upcoming Sessions", icon: Calendar },
    { id: "past-sessions", label: "Past Sessions", icon: Clock },
    { id: "request-session", label: "Request Session", icon: Users },
    { id: "profile", label: "Profile Settings", icon: Settings },
  ];
  
  return (
    <div className="container p-6">
      <h1 className="text-2xl font-bold font-sanskrit mb-6">Student Dashboard</h1>
      
      <HorizontalNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        items={navItems}
        variant="student"
      />

      <StudentDashboardContent
        activeTab={activeTab}
        enrollments={dashboard.enrollments.data || []}
        upcomingSessions={upcomingSessionsList}
        pastSessions={completedSessionsList}
        loadingStates={loadingStates}
        handleJoinClass={handleJoinClass}
      />
    </div>
  );
};

export default StudentDashboardPage;
