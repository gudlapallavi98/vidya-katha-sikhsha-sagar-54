
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSessionRequests from "./TeacherSessionRequests";
import TeacherSchedule from "./TeacherSchedule";
import AvailabilityScheduler from "@/components/teacher/AvailabilityScheduler";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import { SessionRequest, Session } from "@/hooks/types";

interface TeacherDashboardContentProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  teacherCourses: any[];
  coursesLoading: boolean;
  sessionRequests: SessionRequest[];
  requestsLoading: boolean;
  teacherSessions: Session[];
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  totalSessions: {
    completed: number;
    upcoming: number;
  };
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleAcceptSession: (sessionId: string) => Promise<void>;
  handleRejectSession: (sessionId: string) => Promise<void>;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = (props) => {
  const {
    activeTab,
    teacherCourses,
    coursesLoading,
    sessionRequests,
    requestsLoading,
    upcomingSessions,
    sessionsLoading,
    totalSessions,
    handleAcceptSession,
    handleRejectSession,
    handleStartClass,
  } = props;

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <TeacherOverview
            teacherCourses={teacherCourses}
            coursesLoading={coursesLoading}
            sessionRequests={sessionRequests}
            requestsLoading={requestsLoading}
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            totalSessions={totalSessions}
            handleAcceptSession={handleAcceptSession}
            handleRejectSession={handleRejectSession}
            handleStartClass={handleStartClass}
          />
        );
      case "courses":
        return (
          <TeacherCourses
            teacherCourses={teacherCourses}
            coursesLoading={coursesLoading}
          />
        );
      case "sessions":
        return <TeacherSessionRequests />;
      case "schedule":
        return (
          <TeacherSchedule
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            handleStartClass={handleStartClass}
          />
        );
      case "availability":
        return (
          <>
            <h2 className="font-sanskrit text-2xl font-bold mb-6">Set Your Availability</h2>
            <AvailabilityScheduler />
          </>
        );
      case "profile":
        return (
          <>
            <h2 className="font-sanskrit text-2xl font-bold mb-6">Profile Settings</h2>
            <Card className="mb-8">
              <CardContent className="p-6">
                <ProfileSettingsForm role="teacher" />
              </CardContent>
            </Card>
          </>
        );
      default:
        return <p>Select an option from the navigation</p>;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default React.memo(TeacherDashboardContent);
