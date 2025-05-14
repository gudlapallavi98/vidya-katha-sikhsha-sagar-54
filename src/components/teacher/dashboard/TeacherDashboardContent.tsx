
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSessionRequests from "./TeacherSessionRequests";
import TeacherSchedule from "./TeacherSchedule";
import AvailabilityScheduler from "@/components/teacher/AvailabilityScheduler";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import { SessionRequest, Session } from "@/hooks/types";
import DashboardTabs from "@/components/dashboard/DashboardTabs";

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

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({
  activeTab,
  handleTabChange,
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
}) => {
  // Memoize tab content to prevent unnecessary rerenders
  const dashboardTabs = useMemo(() => [
    {
      value: "overview",
      label: "Dashboard",
      content: (
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
      ),
    },
    {
      value: "courses",
      label: "My Courses",
      content: (
        <TeacherCourses
          teacherCourses={teacherCourses}
          coursesLoading={coursesLoading}
        />
      ),
    },
    {
      value: "sessions",
      label: "Session Requests",
      content: <TeacherSessionRequests />,
    },
    {
      value: "schedule",
      label: "My Schedule",
      content: (
        <TeacherSchedule
          upcomingSessions={upcomingSessions}
          sessionsLoading={sessionsLoading}
          handleStartClass={handleStartClass}
        />
      ),
    },
    {
      value: "availability",
      label: "Set Availability",
      content: (
        <>
          <h1 className="font-sanskrit text-3xl font-bold mb-6">Set Your Availability</h1>
          <AvailabilityScheduler />
        </>
      ),
    },
    {
      value: "profile",
      label: "Profile Settings",
      content: (
        <>
          <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
          <Card className="mb-8">
            <CardContent className="p-6">
              <ProfileSettingsForm role="teacher" />
            </CardContent>
          </Card>
        </>
      ),
    },
  ], [
    teacherCourses, 
    coursesLoading,
    sessionRequests,
    requestsLoading,
    upcomingSessions,
    sessionsLoading,
    totalSessions,
    handleAcceptSession,
    handleRejectSession,
    handleStartClass
  ]);

  return (
    <div className="w-full md:w-3/4">
      <DashboardTabs 
        tabs={dashboardTabs} 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
    </div>
  );
};

export default React.memo(TeacherDashboardContent);
