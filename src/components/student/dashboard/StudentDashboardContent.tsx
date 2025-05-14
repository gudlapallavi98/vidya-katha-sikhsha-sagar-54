
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import StudentDashboardOverview from "./StudentDashboardOverview";
import StudentCoursesList from "./StudentCoursesList";
import StudentUpcomingSessions from "./StudentUpcomingSessions";
import StudentPastSessions from "./StudentPastSessions";
import SessionRequestForm from "../SessionRequestForm";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

interface StudentDashboardContentProps {
  activeTab: string;
  enrollments: any[];
  upcomingSessions: any[];
  pastSessions: any[];
  loadingStates: {
    enrollments: boolean;
    upcomingSessions: boolean;
    pastSessions: boolean;
  };
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  activeTab,
  enrollments,
  upcomingSessions,
  pastSessions,
  loadingStates,
  handleJoinClass
}) => {
  // Helper function to get status text based on session status
  const getStatusText = (session: any) => {
    if (session.status === "in_progress") return "In Progress";
    if (session.status === "completed") return "Completed";
    if (session.status === "scheduled") {
      const now = new Date();
      const sessionTime = new Date(session.start_time);
      const timeUntilSession = sessionTime.getTime() - now.getTime();
      const hoursUntil = timeUntilSession / (1000 * 60 * 60);
      
      if (hoursUntil <= 1) return "Starting Soon";
      return "Scheduled";
    }
    return session.status.charAt(0).toUpperCase() + session.status.slice(1);
  };
  
  // Helper function to determine badge class based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_progress":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "starting soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <StudentDashboardOverview
            enrolledCourses={enrollments}
            upcomingSessionsList={upcomingSessions}
            completedSessionsList={pastSessions}
            coursesLoading={loadingStates.enrollments}
            sessionsLoading={loadingStates.upcomingSessions}
            getStatusBadgeClass={getStatusBadgeClass}
            getStatusText={getStatusText}
            handleJoinClass={handleJoinClass}
          />
        );
      case "courses":
        return (
          <StudentCoursesList
            enrolledCourses={enrollments}
            coursesLoading={loadingStates.enrollments}
          />
        );
      case "sessions":
        return (
          <StudentUpcomingSessions
            sessions={upcomingSessions}
            sessionsLoading={loadingStates.upcomingSessions}
            getStatusBadgeClass={getStatusBadgeClass}
            getStatusText={getStatusText}
            handleJoinClass={handleJoinClass}
          />
        );
      case "past-sessions":
        return (
          <StudentPastSessions
            sessions={pastSessions}
            sessionsLoading={loadingStates.pastSessions}
            getStatusBadgeClass={getStatusBadgeClass}
            getStatusText={getStatusText}
          />
        );
      case "request-session":
        return (
          <>
            <h1 className="font-sanskrit text-3xl font-bold mb-6">Request a Session</h1>
            <Card>
              <CardContent className="p-6">
                <SessionRequestForm />
              </CardContent>
            </Card>
          </>
        );
      case "profile":
        return (
          <>
            <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
            <Card className="mb-8">
              <CardContent className="p-6">
                <ProfileSettingsForm role="student" />
              </CardContent>
            </Card>
          </>
        );
      default:
        return <p>Select an option from the sidebar</p>;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default React.memo(StudentDashboardContent);
