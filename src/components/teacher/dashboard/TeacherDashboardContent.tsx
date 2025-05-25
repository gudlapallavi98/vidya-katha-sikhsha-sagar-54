
import React from "react";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSchedule from "./TeacherSchedule";
import TeacherSessionRequests from "./TeacherSessionRequests";
import SessionManagement from "./components/SessionManagement";
import EnhancedAvailabilityScheduler from "../availability/EnhancedAvailabilityScheduler";

interface TeacherDashboardContentProps {
  activeTab: string;
  teacherCourses?: any[];
  coursesLoading?: boolean;
  sessionRequests?: any[];
  requestsLoading?: boolean;
  teacherSessions?: any[];
  upcomingSessions?: any[];
  sessionsLoading?: boolean;
  totalSessions?: {
    completed: number;
    upcoming: number;
  };
  searchQuery?: string;
  handleSearch?: (query: string) => void;
  handleAcceptSession?: (sessionId: string) => Promise<void>;
  handleRejectSession?: (sessionId: string) => Promise<void>;
  handleStartClass?: (sessionId: string) => Promise<void>;
}

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({ 
  activeTab,
  teacherCourses = [],
  coursesLoading = false,
  sessionRequests = [],
  requestsLoading = false,
  teacherSessions = [],
  upcomingSessions = [],
  sessionsLoading = false,
  totalSessions = { completed: 0, upcoming: 0 },
  searchQuery = "",
  handleSearch = () => {},
  handleAcceptSession = async () => {},
  handleRejectSession = async () => {},
  handleStartClass = async () => {},
}) => {
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
      case "schedule":
        return (
          <TeacherSchedule 
            teacherSessions={teacherSessions}
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            handleStartClass={handleStartClass}
          />
        );
      case "availability":
        return <EnhancedAvailabilityScheduler />;
      case "session-requests":
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
      case "session-management":
        return <SessionManagement />;
      default:
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
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {renderContent()}
    </div>
  );
};

export default TeacherDashboardContent;
