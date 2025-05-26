
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSessionRequests from "./TeacherSessionRequests";
import TeacherSchedule from "./TeacherSchedule";
import { EnhancedAvailabilityScheduler } from "../availability/EnhancedAvailabilityScheduler";
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

const TeacherDashboardContent = ({
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
}: TeacherDashboardContentProps) => {
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
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="font-sanskrit text-3xl font-bold">Profile Settings</h1>
              <p className="text-muted-foreground mt-2">
                Manage your profile information and preferences
              </p>
            </div>
            <ProfileSettingsForm role="teacher" />
          </div>
        );
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
    <div className="flex-1 p-8 overflow-auto">
      {renderContent()}
    </div>
  );
};

export default TeacherDashboardContent;
