
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import OverviewTab from "./components/OverviewTab";
import CoursesTab from "./components/CoursesTab";
import SessionsTab from "./components/SessionsTab";
import PaymentHistoryTab from "./components/PaymentHistoryTab";
import SessionRequestForm from "../SessionRequestForm";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

interface StudentDashboardContentProps {
  activeTab: string;
  setActiveTab?: (tab: string) => void;
  enrolledCourses: any[];
  coursesLoading: boolean;
  upcomingSessions: any[];
  sessionsLoading: boolean;
  progress: any[];
  handleJoinClass: (sessionId: string) => Promise<void>;
}

const StudentDashboardContent: React.FC<StudentDashboardContentProps> = ({
  activeTab,
  setActiveTab,
  enrolledCourses,
  coursesLoading,
  upcomingSessions,
  sessionsLoading,
  progress,
  handleJoinClass,
}) => {
  const location = useLocation();

  // Handle navigation state for course enrollment
  useEffect(() => {
    if (location.state?.activeTab && setActiveTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  const renderActiveTab = () => {
    console.log("Rendering tab:", activeTab);
    
    switch (activeTab) {
      case "overview":
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
        return (
          <SessionRequestForm 
            initialState={location.state}
          />
        );
      
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <p className="text-muted-foreground">Manage your profile information and preferences</p>
            </div>
            <ProfileSettingsForm role="student" />
          </div>
        );
      
      default:
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
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      {renderActiveTab()}
    </div>
  );
};

export default StudentDashboardContent;
