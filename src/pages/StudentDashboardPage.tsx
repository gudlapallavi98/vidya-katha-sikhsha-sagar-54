
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { joinSession } from "@/api/dashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import SessionRequestForm from "@/components/student/SessionRequestForm";
import StudentDashboardOverview from "@/components/student/dashboard/StudentDashboardOverview";
import StudentCoursesList from "@/components/student/dashboard/StudentCoursesList";
import StudentUpcomingSessions from "@/components/student/dashboard/StudentUpcomingSessions";
import StudentPastSessions from "@/components/student/dashboard/StudentPastSessions";
import StudentSidebar from "@/components/student/dashboard/StudentSidebar";
import { Tabs } from "@/components/ui/tabs";
import { getStatusBadgeClass, getStatusText } from "@/components/student/dashboard/StudentDashboardUtils";
import { useStudentDashboard } from "@/hooks/use-student-dashboard";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");
  const { user } = useAuth();
  const { toast } = useToast();

  // Use our consolidated dashboard hook
  const dashboard = useStudentDashboard();
  
  // Handle URL parameter once on mount and only when it changes
  useEffect(() => {
    if (tabFromUrl && ["overview", "courses", "sessions", "past-sessions", "request-session", "profile"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Update URL when tab changes - with replace: true to avoid full page reload
  const handleTabChange = (tab: string) => {
    if (activeTab === tab) return; // Prevent unnecessary updates
    
    setActiveTab(tab);
    // Use replace: true to avoid adding to history stack and prevent reloads
    setSearchParams({ tab }, { replace: true });
  };

  // Handle joining a class
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

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar with memoized callback */}
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
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="hidden">
              {/* Hidden TabsList to handle Radix UI TabsTrigger activation */}
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="past-sessions">Past Sessions</TabsTrigger>
              <TabsTrigger value="request-session">Request Session</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="m-0">
              <StudentDashboardOverview 
                enrolledCourses={dashboard.enrollments.data}
                upcomingSessionsList={upcomingSessionsList}
                completedSessionsList={completedSessionsList}
                coursesLoading={dashboard.enrollments.isLoading}
                sessionsLoading={dashboard.upcomingSessions.isLoading}
                getStatusBadgeClass={getStatusBadgeClass}
                getStatusText={getStatusText}
                handleJoinClass={handleJoinClass}
              />
            </TabsContent>
            
            <TabsContent value="courses" className="m-0">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">My Courses</h1>
              <StudentCoursesList 
                enrolledCourses={dashboard.enrollments.data}
                coursesLoading={dashboard.enrollments.isLoading}
              />
            </TabsContent>
            
            <TabsContent value="sessions" className="m-0">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Upcoming Sessions</h1>
              <StudentUpcomingSessions 
                sessions={upcomingSessionsList}
                sessionsLoading={dashboard.upcomingSessions.isLoading}
                getStatusBadgeClass={getStatusBadgeClass}
                getStatusText={getStatusText}
                handleJoinClass={handleJoinClass}
              />
            </TabsContent>
            
            <TabsContent value="past-sessions" className="m-0">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Past Sessions</h1>
              <StudentPastSessions 
                sessions={dashboard.pastSessions.data}
                sessionsLoading={dashboard.pastSessions.isLoading}
                getStatusBadgeClass={getStatusBadgeClass}
                getStatusText={getStatusText}
              />
            </TabsContent>
            
            <TabsContent value="request-session" className="m-0">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Request a Session</h1>
              <SessionRequestForm />
            </TabsContent>
            
            <TabsContent value="profile" className="m-0">
              <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
              <ProfileSettingsForm role="student" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardWithQueryClient;
