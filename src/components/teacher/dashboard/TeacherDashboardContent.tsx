
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSchedule from "./TeacherSchedule";
import TeacherSessionRequests from "./TeacherSessionRequests";
import TeacherProfileSettings from "./TeacherProfileSettings";
import { EnhancedAvailabilityScheduler } from "../availability/EnhancedAvailabilityScheduler";

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
  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <TeacherOverview
            totalSessions={totalSessions}
            sessionsLoading={sessionsLoading}
            upcomingSessions={upcomingSessions}
            teacherCourses={teacherCourses}
            coursesLoading={coursesLoading}
            sessionRequests={sessionRequests}
            requestsLoading={requestsLoading}
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
      
      case "requests":
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
      
      case "availability":
        return <EnhancedAvailabilityScheduler />;
      
      case "profile":
        return <TeacherProfileSettings />;
      
      default:
        return (
          <TeacherOverview
            totalSessions={totalSessions}
            sessionsLoading={sessionsLoading}
            upcomingSessions={upcomingSessions}
            teacherCourses={teacherCourses}
            coursesLoading={coursesLoading}
            sessionRequests={sessionRequests}
            requestsLoading={requestsLoading}
            handleAcceptSession={handleAcceptSession}
            handleRejectSession={handleRejectSession}
            handleStartClass={handleStartClass}
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

export default TeacherDashboardContent;
