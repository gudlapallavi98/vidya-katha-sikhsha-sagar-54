
import React from "react";
import OverviewTab from "./components/OverviewTab";
import CoursesTab from "./components/CoursesTab";
import SessionsTab from "./components/SessionsTab";
import PaymentHistoryTab from "./components/PaymentHistoryTab";
import SessionRequestForm from "../SessionRequestForm";
import { StudentProfileForm } from "@/components/profile/student/StudentProfileForm";

interface StudentDashboardContentProps {
  activeTab: string;
  enrolledCourses: any[];
  coursesLoading: boolean;
  upcomingSessions: any[];
  sessionsLoading: boolean;
  progress: any[];
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
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            enrolledCourses={enrolledCourses}
            coursesLoading={coursesLoading}
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            progress={progress}
          />
        );
      
      case "courses":
        return (
          <CoursesTab
            enrolledCourses={enrolledCourses}
            coursesLoading={coursesLoading}
          />
        );
      
      case "sessions":
        return (
          <SessionsTab
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            handleJoinClass={handleJoinClass}
          />
        );

      case "payments":
        return <PaymentHistoryTab />;
      
      case "request-session":
        return <SessionRequestForm />;
      
      case "profile":
        return <StudentProfileForm activeTab="personal" />;
      
      default:
        return (
          <OverviewTab
            enrolledCourses={enrolledCourses}
            coursesLoading={coursesLoading}
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            progress={progress}
          />
        );
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {renderActiveTab()}
    </div>
  );
};

export default StudentDashboardContent;
