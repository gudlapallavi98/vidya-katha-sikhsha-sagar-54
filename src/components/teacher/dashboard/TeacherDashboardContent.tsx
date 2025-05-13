
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const TeacherDashboardContent: React.FC<TeacherDashboardContentProps> = React.memo(({
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
        {/* Hidden TabsList for Radix UI state management - this is critical */}
        <TabsList className="hidden">
          <TabsTrigger value="overview">Dashboard</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="sessions">Session Requests</TabsTrigger>
          <TabsTrigger value="schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="availability">Set Availability</TabsTrigger>
          <TabsTrigger value="profile">Profile Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="m-0 focus:outline-none">
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
        
        <TabsContent value="courses" className="m-0 focus:outline-none">
          <TeacherCourses
            teacherCourses={teacherCourses}
            coursesLoading={coursesLoading}
          />
        </TabsContent>
        
        <TabsContent value="sessions" className="m-0 focus:outline-none">
          <TeacherSessionRequests />
        </TabsContent>
        
        <TabsContent value="schedule" className="m-0 focus:outline-none">
          <TeacherSchedule
            upcomingSessions={upcomingSessions}
            sessionsLoading={sessionsLoading}
            handleStartClass={handleStartClass}
          />
        </TabsContent>

        <TabsContent value="availability" className="m-0 focus:outline-none">
          <h1 className="font-sanskrit text-3xl font-bold mb-6">Set Your Availability</h1>
          <AvailabilityScheduler />
        </TabsContent>
        
        <TabsContent value="profile" className="m-0 focus:outline-none">
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
});

TeacherDashboardContent.displayName = "TeacherDashboardContent";

export default TeacherDashboardContent;
