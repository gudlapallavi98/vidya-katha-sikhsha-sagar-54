
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import TeacherOverview from "./TeacherOverview";
import TeacherCourses from "./TeacherCourses";
import TeacherSessionRequests from "./TeacherSessionRequests";
import TeacherSchedule from "./TeacherSchedule";
import AvailabilityScheduler from "@/components/teacher/AvailabilityScheduler";
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
  sessionsLoading,
  totalSessions,
  searchQuery,
  handleSearch,
  handleAcceptSession,
  handleRejectSession,
  handleStartClass,
}) => {
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
        
        <TabsContent value="courses">
          <TeacherCourses
            teacherCourses={teacherCourses}
            coursesLoading={coursesLoading}
          />
        </TabsContent>
        
        <TabsContent value="sessions">
          {/* Remove the props that are causing issues - TeacherSessionRequests doesn't need them */}
          <TeacherSessionRequests />
        </TabsContent>
        
        <TabsContent value="schedule">
          <TeacherSchedule
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            handleStartClass={handleStartClass}
          />
        </TabsContent>

        <TabsContent value="availability">
          <h1 className="font-sanskrit text-3xl font-bold mb-6">Set Your Availability</h1>
          <AvailabilityScheduler />
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
