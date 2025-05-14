
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";
import { PanelLeftIcon } from "lucide-react";
import StudentSidebar from "@/components/student/dashboard/StudentSidebar";
import StudentDashboardContent from "@/components/student/dashboard/StudentDashboardContent";
import { Button } from "@/components/ui/button";

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
  const { collapsed, toggleSidebar } = useSidebarState();
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
  
  return (
    <div className="container p-0 h-full flex">
      {/* Collapsible Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-64"} min-h-[calc(100vh-4rem)] border-r`}>
        <StudentSidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange}
          firstName={user?.user_metadata?.first_name}
          lastName={user?.user_metadata?.last_name}
          collapsed={collapsed}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-4"
          >
            <PanelLeftIcon className={`h-5 w-5 transition-transform ${collapsed ? "rotate-180" : ""}`} />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <h1 className="text-2xl font-bold font-sanskrit">Student Dashboard</h1>
        </div>

        <StudentDashboardContent
          activeTab={activeTab}
          enrollments={dashboard.enrollments.data || []}
          upcomingSessions={upcomingSessionsList}
          pastSessions={completedSessionsList}
          loadingStates={loadingStates}
          handleJoinClass={handleJoinClass}
        />
      </div>
    </div>
  );
};

export default StudentDashboardPage;
