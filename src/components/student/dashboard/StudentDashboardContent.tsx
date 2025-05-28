
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTabNavigation } from "@/hooks/use-tab-navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { activeTab: tabFromUrl, handleTabChange } = useTabNavigation(activeTab);

  // Handle navigation state for course enrollment
  useEffect(() => {
    if (location.state?.activeTab && setActiveTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  // Sync with URL tab parameter
  useEffect(() => {
    if (setActiveTab && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl, activeTab, setActiveTab]);

  const currentTab = tabFromUrl || activeTab;

  const renderActiveTab = () => {
    switch (currentTab) {
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
          <Tabs value="personal" className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="exams">Exam History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <ProfileSettingsForm role="student" />
            </TabsContent>
            <TabsContent value="education">
              <ProfileSettingsForm role="student" />
            </TabsContent>
            <TabsContent value="preferences">
              <ProfileSettingsForm role="student" />
            </TabsContent>
            <TabsContent value="exams">
              <ProfileSettingsForm role="student" />
            </TabsContent>
          </Tabs>
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
