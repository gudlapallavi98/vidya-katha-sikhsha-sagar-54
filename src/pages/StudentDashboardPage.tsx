
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  useStudentEnrollments, 
  useStudentUpcomingSessions, 
  useStudentProgress, 
  useStudentAchievements, 
  useStudentPastSessions 
} from "@/hooks/use-dashboard-data";
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
  
  const { data: enrolledCourses = [], isLoading: coursesLoading } = useStudentEnrollments();
  const { data: progress = [], isLoading: progressLoading } = useStudentProgress();
  const { data: upcomingSessions = [], isLoading: sessionsLoading } = useStudentUpcomingSessions();
  const { data: pastSessions = [], isLoading: pastSessionsLoading } = useStudentPastSessions();
  const { data: achievements = [], isLoading: achievementsLoading } = useStudentAchievements();

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    // Update URL when tab changes
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Calculate completed sessions from progress data
  const completedSessions = progress.filter(p => p.completed).length;

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

  // Filter sessions by status for display
  const upcomingSessionsList = upcomingSessions.filter(session => {
    return !session.display_status || session.display_status === 'upcoming';
  });
  
  const completedSessionsList = upcomingSessions.filter(session => {
    return session.display_status && session.display_status !== 'upcoming';
  });

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <StudentSidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            firstName={user?.user_metadata?.first_name}
            lastName={user?.user_metadata?.last_name}
          />
        </div>

        {/* Main content */}
        <div className="w-full md:w-3/4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="overview" className="m-0">
              <StudentDashboardOverview 
                enrolledCourses={enrolledCourses}
                upcomingSessionsList={upcomingSessionsList}
                completedSessionsList={completedSessionsList}
                coursesLoading={coursesLoading}
                sessionsLoading={sessionsLoading}
                getStatusBadgeClass={getStatusBadgeClass}
                getStatusText={getStatusText}
                handleJoinClass={handleJoinClass}
              />
            </TabsContent>
            
            <TabsContent value="courses" className="m-0">
              <StudentCoursesList 
                enrolledCourses={enrolledCourses}
                coursesLoading={coursesLoading}
              />
            </TabsContent>
            
            <TabsContent value="sessions" className="m-0">
              <StudentUpcomingSessions 
                sessions={upcomingSessionsList}
                sessionsLoading={sessionsLoading}
                getStatusBadgeClass={getStatusBadgeClass}
                getStatusText={getStatusText}
                handleJoinClass={handleJoinClass}
              />
            </TabsContent>
            
            <TabsContent value="past-sessions" className="m-0">
              <StudentPastSessions 
                sessions={pastSessions}
                sessionsLoading={pastSessionsLoading}
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
