
import React from "react";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import DashboardCard from "@/components/dashboard/DashboardCard";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSessionRequests from "./TeacherSessionRequests";
import TeacherSchedule from "./TeacherSchedule";
import EnhancedAvailabilityScheduler from "@/components/teacher/availability/EnhancedAvailabilityScheduler";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

interface TeacherDashboardContentProps {
  activeTab: string;
  teacherCourses: any[];
  coursesLoading: boolean;
  sessionRequests: any[];
  requestsLoading: boolean;
  teacherSessions: any[];
  upcomingSessions: any[];
  sessionsLoading: boolean;
  totalSessions: { completed: number; upcoming: number };
  searchQuery: string;
  handleSearch: (query: string) => void;
  handleAcceptSession: (sessionId: string) => Promise<void>;
  handleRejectSession: (sessionId: string) => Promise<void>;
  handleStartClass: (sessionId: string) => Promise<void>;
}

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({
  activeTab,
  teacherCourses,
  coursesLoading,
  sessionRequests,
  requestsLoading,
  teacherSessions,
  upcomingSessions,
  sessionsLoading,
  totalSessions,
  searchQuery,
  handleSearch,
  handleAcceptSession,
  handleRejectSession,
  handleStartClass,
}) => {
  if (activeTab === "overview") {
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
  }

  if (activeTab === "courses") {
    return (
      <TeacherCourses
        teacherCourses={teacherCourses}
        coursesLoading={coursesLoading}
      />
    );
  }

  if (activeTab === "sessions") {
    return (
      <TeacherSessionRequests
        sessionRequests={sessionRequests}
        requestsLoading={requestsLoading}
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        handleAcceptSession={handleAcceptSession}
        handleRejectSession={handleRejectSession}
      />
    );
  }

  if (activeTab === "schedule") {
    return (
      <TeacherSchedule
        teacherSessions={teacherSessions}
        upcomingSessions={upcomingSessions}
        sessionsLoading={sessionsLoading}
        handleStartClass={handleStartClass}
      />
    );
  }

  if (activeTab === "availability") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Set Availability" />
        <DashboardCard>
          <EnhancedAvailabilityScheduler />
        </DashboardCard>
      </DashboardShell>
    );
  }

  if (activeTab === "profile") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Profile Settings" />
        <DashboardCard>
          <ProfileSettingsForm role="teacher" />
        </DashboardCard>
      </DashboardShell>
    );
  }

  return null;
};

export default TeacherDashboardContent;
