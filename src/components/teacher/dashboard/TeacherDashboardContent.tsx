
import React from "react";
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

// Define tabs creator function outside component to avoid hooks issues
const createTeacherTabs = (props: TeacherDashboardContentProps) => [
  {
    value: "overview",
    label: "Dashboard",
    content: (
      <TeacherOverview
        teacherCourses={props.teacherCourses}
        coursesLoading={props.coursesLoading}
        sessionRequests={props.sessionRequests}
        requestsLoading={props.requestsLoading}
        upcomingSessions={props.upcomingSessions}
        sessionsLoading={props.sessionsLoading}
        totalSessions={props.totalSessions}
        handleAcceptSession={props.handleAcceptSession}
        handleRejectSession={props.handleRejectSession}
        handleStartClass={props.handleStartClass}
      />
    ),
  },
  {
    value: "courses",
    label: "My Courses",
    content: (
      <TeacherCourses
        teacherCourses={props.teacherCourses}
        coursesLoading={props.coursesLoading}
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
        upcomingSessions={props.upcomingSessions}
        sessionsLoading={props.sessionsLoading}
        handleStartClass={props.handleStartClass}
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
];

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = (props) => {
  // Create tabs with stable references
  const dashboardTabs = createTeacherTabs(props);

  return (
    <div className="w-full md:w-3/4">
      <DashboardTabs 
        tabs={dashboardTabs} 
        activeTab={props.activeTab}
        onTabChange={props.handleTabChange}
      />
    </div>
  );
};

export default React.memo(TeacherDashboardContent);
