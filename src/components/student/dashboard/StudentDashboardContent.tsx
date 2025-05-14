
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
  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <StudentDashboardOverview
            enrollments={enrollments}
            upcomingSessions={upcomingSessions}
            isLoading={loadingStates.enrollments || loadingStates.upcomingSessions}
            handleJoinClass={handleJoinClass}
          />
        );
      case "courses":
        return (
          <>
            <h1 className="font-sanskrit text-3xl font-bold mb-6">My Courses</h1>
            <StudentCoursesList 
              enrollments={enrollments} 
              isLoading={loadingStates.enrollments} 
            />
          </>
        );
      case "sessions":
        return (
          <>
            <h1 className="font-sanskrit text-3xl font-bold mb-6">Upcoming Sessions</h1>
            <StudentUpcomingSessions
              sessions={upcomingSessions}
              isLoading={loadingStates.upcomingSessions}
              handleJoinClass={handleJoinClass}
            />
          </>
        );
      case "past-sessions":
        return (
          <>
            <h1 className="font-sanskrit text-3xl font-bold mb-6">Past Sessions</h1>
            <StudentPastSessions
              sessions={pastSessions}
              isLoading={loadingStates.pastSessions}
            />
          </>
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
