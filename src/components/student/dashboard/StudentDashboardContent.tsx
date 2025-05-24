
import React from "react";
import { DashboardHeader, DashboardShell } from "@/components/ui/dashboard-shell";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import SessionRequestForm from "@/components/student/SessionRequestForm";
import OverviewTab from "./components/OverviewTab";
import CoursesTab from "./components/CoursesTab";
import SessionsTab from "./components/SessionsTab";
import { Enrollment, Progress as StudentProgress, Session } from "@/hooks/types";

interface StudentDashboardContentProps {
  activeTab: string;
  enrolledCourses: Enrollment[];
  coursesLoading: boolean;
  upcomingSessions: Session[];
  sessionsLoading: boolean;
  progress: StudentProgress[];
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  activeTab,
  enrolledCourses,
  coursesLoading,
  upcomingSessions,
  sessionsLoading,
  progress,
  handleJoinClass,
}) => {
  if (activeTab === "overview") {
    return (
      <OverviewTab
        enrolledCourses={enrolledCourses}
        coursesLoading={coursesLoading}
        upcomingSessions={upcomingSessions}
        sessionsLoading={sessionsLoading}
        progress={progress}
        handleJoinClass={handleJoinClass}
      />
    );
  }
  
  if (activeTab === "courses") {
    return (
      <CoursesTab
        enrolledCourses={enrolledCourses}
        coursesLoading={coursesLoading}
      />
    );
  }
  
  if (activeTab === "sessions") {
    return (
      <SessionsTab
        upcomingSessions={upcomingSessions}
        sessionsLoading={sessionsLoading}
        handleJoinClass={handleJoinClass}
      />
    );
  }
  
  if (activeTab === "request-session") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Request a Session" />
        <DashboardCard>
          <SessionRequestForm />
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  if (activeTab === "profile") {
    return (
      <DashboardShell>
        <DashboardHeader heading="Profile Settings" />
        <DashboardCard>
          <ProfileSettingsForm role="student" />
        </DashboardCard>
      </DashboardShell>
    );
  }
  
  return null;
};

export default StudentDashboardContent;
