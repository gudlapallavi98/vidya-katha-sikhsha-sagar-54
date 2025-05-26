
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
  handleAcceptSession: (sessionId: string) => void;
  handleRejectSession: (sessionId: string) => void;
  handleStartClass: (sessionId: string) => void;
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
            totalCourses={teacherCourses.length}
            totalSessions={totalSessions}
            upcomingSessions={upcomingSessions}
            sessionRequests={sessionRequests}
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
            sessions={teacherSessions}
            isLoading={sessionsLoading}
            onStartClass={handleStartClass}
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
            <ProfileSettingsForm />
          </div>
        );
      default:
        return (
          <TeacherOverview
            totalCourses={teacherCourses.length}
            totalSessions={totalSessions}
            upcomingSessions={upcomingSessions}
            sessionRequests={sessionRequests}
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
