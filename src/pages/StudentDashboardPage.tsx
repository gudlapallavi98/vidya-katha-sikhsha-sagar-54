
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { joinSession } from "@/api/dashboard";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import SessionRequestForm from "@/components/student/SessionRequestForm";
import StudentDashboardOverview from "@/components/student/dashboard/StudentDashboardOverview";
import StudentCoursesList from "@/components/student/dashboard/StudentCoursesList";
import StudentUpcomingSessions from "@/components/student/dashboard/StudentUpcomingSessions";
import StudentPastSessions from "@/components/student/dashboard/StudentPastSessions";
import StudentSidebar from "@/components/student/dashboard/StudentSidebar";
import { useDashboardTabs } from "@/hooks/use-dashboard-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { Card, CardContent } from "@/components/ui/card";
import { getStatusBadgeClass, getStatusText } from "@/components/student/dashboard/StudentDashboardUtils";

// Create a persistent QueryClient instance with consistent configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
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

// Define tabs outside of the component render function
// This prevents hooks rendering inconsistency
const createStudentTabs = (
  enrollments,
  upcomingSessions,
  completedSessions,
  loadingStates,
  handleJoinClass
) => [
  {
    value: "overview",
    label: "Overview",
    content: (
      <StudentDashboardOverview 
        enrolledCourses={enrollments}
        upcomingSessionsList={upcomingSessions}
        completedSessionsList={completedSessions}
        coursesLoading={loadingStates.enrollments}
        sessionsLoading={loadingStates.sessions}
        getStatusBadgeClass={getStatusBadgeClass}
        getStatusText={getStatusText}
        handleJoinClass={handleJoinClass}
      />
    )
  },
  {
    value: "courses",
    label: "Courses",
    content: (
      <>
        <h1 className="font-sanskrit text-3xl font-bold mb-6">My Courses</h1>
        <StudentCoursesList 
          enrolledCourses={enrollments}
          coursesLoading={loadingStates.enrollments}
        />
      </>
    )
  },
  {
    value: "sessions",
    label: "Sessions",
    content: (
      <>
        <h1 className="font-sanskrit text-3xl font-bold mb-6">Upcoming Sessions</h1>
        <StudentUpcomingSessions 
          sessions={upcomingSessions}
          sessionsLoading={loadingStates.sessions}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusText={getStatusText}
          handleJoinClass={handleJoinClass}
        />
      </>
    )
  },
  {
    value: "past-sessions",
    label: "Past Sessions",
    content: (
      <>
        <h1 className="font-sanskrit text-3xl font-bold mb-6">Past Sessions</h1>
        <StudentPastSessions 
          sessions={completedSessions}
          sessionsLoading={loadingStates.pastSessions}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusText={getStatusText}
        />
      </>
    )
  },
  {
    value: "request-session",
    label: "Request Session",
    content: (
      <>
        <h1 className="font-sanskrit text-3xl font-bold mb-6">Request a Session</h1>
        <SessionRequestForm />
      </>
    )
  },
  {
    value: "profile",
    label: "Profile Settings",
    content: (
      <>
        <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
        <Card>
          <CardContent className="p-6">
            <ProfileSettingsForm role="student" />
          </CardContent>
        </Card>
      </>
    )
  }
];

const StudentDashboard = () => {
  // Use our improved dashboard tabs hook
  const { activeTab, handleTabChange } = useDashboardTabs("overview");
  const { user } = useAuth();
  const { toast } = useToast();

  // Use our consolidated dashboard hook
  const dashboard = useStudentDashboard();
  
  // Handle joining a class
  const handleJoinClass = async (sessionId) => {
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

  // Handle loading state
  if (dashboard.isLoading) {
    return (
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/4">
            <Skeleton className="h-[400px] w-full" />
          </div>
          <div className="w-full md:w-3/4">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Filter sessions by status for display
  const upcomingSessionsList = dashboard.upcomingSessions.data.filter(session => {
    return !session.display_status || session.display_status === 'upcoming';
  });
  
  const completedSessionsList = dashboard.pastSessions.data.filter(session => {
    return session.display_status === 'attended' || session.display_status === 'missed';
  });

  const loadingStates = {
    enrollments: dashboard.enrollments.isLoading,
    sessions: dashboard.upcomingSessions.isLoading,
    pastSessions: dashboard.pastSessions.isLoading
  };
  
  // Create tabs with data from the dashboard
  // IMPORTANT: This must be created here after all state values are defined
  const studentTabs = createStudentTabs(
    dashboard.enrollments.data,
    upcomingSessionsList,
    completedSessionsList,
    loadingStates,
    handleJoinClass
  );

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <StudentSidebar 
            activeTab={activeTab} 
            setActiveTab={handleTabChange} 
            firstName={user?.user_metadata?.first_name}
            lastName={user?.user_metadata?.last_name}
          />
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <DashboardTabs
            tabs={studentTabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardWithQueryClient;
