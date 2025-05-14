
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import DashboardTiles from "./components/DashboardTiles";
import TeacherOverview from "./TeacherOverview";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";
import { SessionRequest, Session } from "@/hooks/types";

interface TeacherDashboardContentProps {
  activeTab: string;
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

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = ({
  activeTab,
  teacherCourses,
  coursesLoading,
  sessionRequests,
  requestsLoading,
  upcomingSessions,
  teacherSessions,
  sessionsLoading,
  totalSessions,
  searchQuery,
  handleSearch,
  handleAcceptSession,
  handleRejectSession,
  handleStartClass,
}) => {
  // Show dashboard tiles if we're on the overview tab
  if (activeTab === "overview") {
    return (
      <div className="w-full md:w-3/4">
        <h1 className="font-sanskrit text-3xl font-bold mb-6">Teacher Dashboard</h1>
        <DashboardTiles activeTab={activeTab} />
        <div className="mt-8">
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
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full md:w-3/4">
      <Tabs value={activeTab} className="w-full">
        <TabsContent value="overview" className="m-0">
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
        </TabsContent>
        
        <TabsContent value="profile">
          <h1 className="font-sanskrit text-3xl font-bold mb-6">Profile Settings</h1>
          <Card className="mb-8">
            <CardContent className="p-6">
              <ProfileSettingsForm role="teacher" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboardContent;
